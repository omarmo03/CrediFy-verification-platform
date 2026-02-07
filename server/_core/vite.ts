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
      const clientTemplate = path.resolve(
        __dirname,
        "../..",
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
  // 1. تحديد المسار الرئيسي للمشروع (بيشتغل في أي بيئة)
  const rootDir = process.cwd();
  
  // 2. قائمة بكل الأماكن المحتملة لملفات الموقع (عشان ميتوهش)
  const possiblePaths = [
    path.resolve(rootDir, "dist", "public"), // المسار القياسي لـ Replit/Render
    path.resolve(rootDir, "dist"),           // أحيانا بيكون هنا
    path.resolve(rootDir, "public"),         // أحيانا بيكون هنا
    path.resolve(__dirname, "public"),       // المسار القديم
  ];

  let distPath = "";

  // 3. السيرفر هيدور فيهم واحد واحد لحد ما يلاقيه
  for (const p of possiblePaths) {
    if (fs.existsSync(path.join(p, "index.html"))) {
      distPath = p;
      console.log("✅ Found build files at:", distPath); // رسالة تأكيد في اللوج
      break;
    }
  }

  // 4. لو ملقاش حاجة خالص (دي المصيبة)
  if (!distPath) {
    console.error("❌ CRITICAL: Could not find index.html in any of these paths:", possiblePaths);
    // هنفترض الافتراضي عشان الموقع ميقعش
    distPath = path.resolve(rootDir, "dist", "public");
  }

  // 5. تشغيل الملفات
  app.use(express.static(distPath));

  app.use("*", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
       res.sendFile(indexPath);
    } else {
       res.status(500).send("Server Error: Build files not found. Check logs.");
    }
  });
}
