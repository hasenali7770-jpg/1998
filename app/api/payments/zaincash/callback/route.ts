import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

/**
 * ZainCash redirects back to:
 *   successUrl?token=JWT_TOKEN
 *   failureUrl?token=JWT_TOKEN
 *
 * We verify the token with HS256 using ZAINCASH_API_KEY then update our order.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ ok: false, error: "token مفقود" }, { status: 400 });
  }

  const apiKey = process.env.ZAINCASH_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "ZAINCASH_API_KEY مفقود" }, { status: 500 });
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(apiKey), {
      algorithms: ["HS256"],
    });

    // Make payload safe for Prisma Json field
    const safePayload = JSON.parse(JSON.stringify(payload));

    // Payload typically includes orderId + transactionId + status (per ZainCash docs)
    const orderId = String((safePayload as any).orderId ?? "");
    const status = String((safePayload as any).status ?? "");
    const transactionId = String((safePayload as any).transactionId ?? (safePayload as any).id ?? "");

    if (!orderId) {
      return NextResponse.json(
        { ok: false, error: "orderId غير موجود داخل التوكن" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { course: true, user: true },
    });

    if (!order) {
      return NextResponse.json({ ok: false, error: "الطلب غير موجود" }, { status: 404 });
    }

    // Map statuses: SUCCESS / FAILED / PENDING ...
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
            raw: { redirectTokenPayload: safePayload, transactionId },
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
            raw: { redirectTokenPayload: safePayload, transactionId },
          },
        }),
      ]);
    }

    return NextResponse.json({ ok: true, data: { orderId, status, payload: safePayload } });
  } catch (e) {
    console.error("ZainCash callback verify error:", e);
    return NextResponse.json({ ok: false, error: "فشل التحقق من التوكن" }, { status: 400 });
  }
}
