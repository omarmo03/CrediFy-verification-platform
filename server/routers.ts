import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  searchProfiles,
  getAllProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
  createJoinRequest,
  getJoinRequests,
  createReport,
  getReports,
  updateReportStatus,
  smartSearch,
} from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Profile routers
  profiles: router({
    search: publicProcedure
      .input(z.object({ query: z.string().min(1) }))
      .query(async ({ input }) => {
        return await searchProfiles(input.query);
      }),

    getAll: publicProcedure.query(async () => {
      return await getAllProfiles();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getProfileById(input.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          profileLink: z.string().url(),
          status: z.enum(["trusted", "scammer", "not_found"]),
          rank: z.enum(["verified", "top_seller", "middleman"]).optional(),
          proofCount: z.number().int().min(0).default(0),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can create profiles" });
        }

        const result = await createProfile(input);
        if (!result) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create profile" });
        }
        return result;
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().min(1).optional(),
          profileLink: z.string().url().optional(),
          status: z.enum(["trusted", "scammer", "not_found"]).optional(),
          proofCount: z.number().int().min(0).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can update profiles" });
        }

        const { id, ...data } = input;
        const result = await updateProfile(id, data);
        if (!result) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update profile" });
        }
        return result;
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can delete profiles" });
        }

        const success = await deleteProfile(input.id);
        if (!success) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to delete profile" });
        }
        return { success: true };
      }),
  }),

  // Join Request routers
  joinRequests: router({
    create: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          name: z.string().min(1),
          profileLink: z.string().url(),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const result = await createJoinRequest(input);
        if (!result) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create join request" });
        }
        return result;
      }),

    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can view join requests" });
      }
      return await getJoinRequests();
    }),
  }),

  // Reports routers
  reports: router({
    create: publicProcedure
      .input(
        z.object({
          reporterEmail: z.string().email(),
          reporterName: z.string().min(1),
          scammerName: z.string().min(1),
          scammerLink: z.string().url(),
          description: z.string().min(10),
        })
      )
      .mutation(async ({ input }) => {
        const result = await createReport(input);
        if (!result) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create report" });
        }
        return result;
      }),

    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can view reports" });
      }
      return await getReports();
    }),

    updateStatus: protectedProcedure
      .input(z.object({ id: z.number(), status: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can update reports" });
        }
        const success = await updateReportStatus(input.id, input.status);
        if (!success) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update report" });
        }
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
