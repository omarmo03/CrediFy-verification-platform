import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // ✅ تعديل: استخدام process.cwd() عشان نتفادى خطأ __dirname
      const clientTemplate = path.resolve(
        process.cwd(),
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // ✅ تعديل: البحث عن ملفات البناء بطريقة ذكية وآمنة
  const rootDir = process.cwd();
  
  // الاماكن المحتملة للملفات
  const possiblePaths = [
    path.resolve(rootDir, "dist", "public"),
    path.resolve(rootDir, "dist"),
    path.resolve(rootDir, "public"),
  ];

  let distPath = "";

  // ندور فيهم
  for (const p of possiblePaths) {
    // نتأكد ان فيه ملف index.html
    if (fs.existsSync(path.join(p, "index.html"))) {
      distPath = p;
      console.log("✅ [Fixed] Found build files at:", distPath);
      break;
    }
  }

  // لو ملقيناش، نستخدم المسار الافتراضي وخلاص
  if (!distPath) {
    console.error("⚠️ Warning: Could not find build files. Defaulting to dist/public");
    distPath = path.resolve(rootDir, "dist", "public");
  }

  app.use(express.static(distPath));

  app.use("*", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
       res.sendFile(indexPath);
    } else {
       res.status(500).send(`
         <h1>Deployment Error</h1>
         <p>Could not find index.html in: ${distPath}</p>
         <p>Current Directory: ${rootDir}</p>
       `);
    }
  });
}
