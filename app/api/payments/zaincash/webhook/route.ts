import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

/**
 * ZainCash Webhook: POST application/json
 * { "webhook_token": "JWT..." }
 *
 * Source of truth should be the webhook.
 */
export async function POST(req: Request) {
  const apiKey = process.env.ZAINCASH_API_KEY;
  if (!apiKey) return NextResponse.json({ ok: false, error: "ZAINCASH_API_KEY مفقود" }, { status: 500 });

  try {
    const body = await req.json().catch(() => null);
    const token = body?.webhook_token;
    if (!token) return NextResponse.json({ ok: false, error: "webhook_token مفقود" }, { status: 400 });

    const { payload } = await jwtVerify(String(token), new TextEncoder().encode(apiKey), {
      algorithms: ["HS256"],
    });

    // Make payload safe for Prisma Json field
    const safePayload = JSON.parse(JSON.stringify(payload));

    const orderId = String((safePayload as any).orderId ?? "");
    const status = String((safePayload as any).status ?? "");
    const eventId = String((safePayload as any).eventId ?? "");
    const transactionId = String((safePayload as any).transactionId ?? (safePayload as any).id ?? "");

    if (!orderId) return NextResponse.json({ ok: true }); // acknowledge but can't process

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ ok: true });

    // Idempotency: if already final, ignore
    if (order.status === "paid" || order.status === "failed" || order.status === "refunded") {
      return NextResponse.json({ ok: true });
    }

    if (status === "SUCCESS") {
      await prisma.$transaction([
        prisma.order.update({ where: { id: order.id }, data: { status: "paid" } }),
        prisma.payment.create({
          data: {
            orderId: order.id,
            provider: "zaincash",
            status: "succeeded",
            amount: order.amount,
            currency: order.currency,
            raw: { eventId, transactionId, webhookPayload: safePayload },
          },
        }),
        prisma.enrollment.upsert({
          where: { userId_courseId: { userId: order.userId, courseId: order.courseId } },
          update: {},
          create: { userId: order.userId, courseId: order.courseId },
        }),
      ]);
    } else if (status === "FAILED" || status === "EXPIRED") {
      await prisma.$transaction([
        prisma.order.update({ where: { id: order.id }, data: { status: "failed" } }),
        prisma.payment.create({
          data: {
            orderId: order.id,
            provider: "zaincash",
            status: "failed",
            amount: order.amount,
            currency: order.currency,
            raw: { eventId, transactionId, webhookPayload: safePayload },
          },
        }),
      ]);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("ZainCash webhook error:", e);
    // Still return 200 to prevent retries storm; log is enough
    return NextResponse.json({ ok: true });
  }
}
