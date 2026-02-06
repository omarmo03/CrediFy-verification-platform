import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  registerOAuthRoutes(app);

  // 🔒 المنطقة المحظورة (الباب السري)
  // الرابط ده شكله عادي، بس لو كتبت معاه الباسورد هيدخلك
  app.get("/api/system-check", (req, res) => {
    const accessKey = req.query.key;

    // 👇 دي كلمة السر بتاعتك (غيرها لو تحب)
    if (accessKey === "Omar-Top-Secret-2026") {
      // لو الباسورد صح، بنديك "كوكي" (تصريح) لمدة 30 يوم
      res.setHeader('Set-Cookie', 'admin_access_token=GRANTED; Path=/; HttpOnly; Max-Age=2592000');
      // ونحولك فوراً للوحة التحكم
      return res.redirect('/admin-dashboard-secret');
    }

    // لو الباسورد غلط، بنعمل عبيط ونقول "الصفحة مش موجودة" 404 🙈
    res.status(404).send("Not Found");
  });

  // 🚪 الخروج (يقفل الباب وراك)
  app.get("/logout-secure", (req, res) => {
    res.setHeader('Set-Cookie', 'admin_access_token=DENIED; Path=/; Max-Age=0');
    res.redirect('/');
  });

  // 👮‍♂️ الحارس (بيشوف التصريح)
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext: async (opts) => {
        const ctx = await createContext(opts);
        
        // كشف التصريح
        const cookieHeader = opts.req.headers.cookie || "";
        
        if (cookieHeader.includes("admin_access_token=GRANTED")) {
          // 👑 أهلاً بالمدير
          return {
            ...ctx,
            user: {
              id: 999,
              email: "admin@credify.app",
              role: "admin",
              name: "Super Admin",
              createdAt: new Date(),
            }
          };
        }
        
        // ✋ مواطن عادي
        return ctx;
      },
    })
  );

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
