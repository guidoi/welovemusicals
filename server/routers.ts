import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { deletePriceSaleOverride, listPriceSaleOverrides, upsertPriceSaleOverride } from "./priceSales";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
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

  priceSales: router({
    listPublic: publicProcedure.query(async () => {
      const overrides = await listPriceSaleOverrides();
      return overrides.map(({ musicalId, priceFrom, saleEnabled, saleLabel, saleDiscount, saleNote, saleEndsAt }) => ({
        musicalId,
        priceFrom,
        saleEnabled,
        saleLabel,
        saleDiscount,
        saleNote,
        saleEndsAt,
      }));
    }),
    listForAdmin: adminProcedure.query(() => listPriceSaleOverrides()),
    save: adminProcedure
      .input(
        z.object({
          musicalId: z.string().min(1).max(128),
          priceFrom: z.string().trim().min(1).max(32),
          saleEnabled: z.boolean(),
          saleLabel: z.string().trim().max(64).nullable().optional(),
          saleDiscount: z.string().trim().max(64).nullable().optional(),
          saleNote: z.string().trim().max(500).nullable().optional(),
          saleEndsAt: z.number().int().nullable().optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        await upsertPriceSaleOverride({
          ...input,
          saleEndsAt: input.saleEndsAt ? new Date(input.saleEndsAt) : null,
          updatedByOpenId: ctx.user.openId,
        });
        return { success: true } as const;
      }),
    reset: adminProcedure
      .input(z.object({ musicalId: z.string().min(1).max(128) }))
      .mutation(async ({ input }) => {
        await deletePriceSaleOverride(input.musicalId);
        return { success: true } as const;
      }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
