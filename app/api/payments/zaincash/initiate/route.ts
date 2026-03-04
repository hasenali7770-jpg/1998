import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { zaincashInitPayment } from "@/lib/providers/zaincash";
import { requireUser } from "@/lib/auth";

const BodySchema = z.object({
  orderId: z.string().uuid(),
  customerPhone: z.string().min(8).max(20).optional().nullable(),
});

export async function POST(req: Request) {
  const { user, profile } = await requireUser();
  if (!user || !profile) {
    return NextResponse.json({ ok: false, error: "يجب تسجيل الدخول" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "بيانات غير صالحة" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: { id: parsed.data.orderId, userId: profile.id, provider: "zaincash" },
      include: { course: true },
    });

    if (!order) return NextResponse.json({ ok: false, error: "الطلب غير موجود" }, { status: 404 });

    const appUrl = process.env.APP_URL;
    if (!appUrl) throw new Error("Missing APP_URL");

    const serviceType = process.env.ZAINCASH_SERVICE_TYPE;
    if (!serviceType) throw new Error("Missing ZAINCASH_SERVICE_TYPE");

    const init = await zaincashInitPayment({
      orderId: order.id,
      amountIQD: order.amount,
      customerPhone: parsed.data.customerPhone,
      successUrl: `${appUrl}/payment/success?provider=zaincash&orderId=${order.id}`,
      failureUrl: `${appUrl}/payment/failed?provider=zaincash&orderId=${order.id}`,
      notificationUrl: `${appUrl}/api/payments/zaincash/webhook`,
      serviceType,
      language: "Ar",
    });

    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { providerRef: init.transactionId },
      }),
      prisma.payment.create({
        data: {
          orderId: order.id,
          provider: "zaincash",
          status: "pending",
          amount: order.amount,
          currency: order.currency,
          raw: { init },
        },
      }),
    ]);

    return NextResponse.json({ ok: true, data: { redirectUrl: init.redirectUrl } });
  } catch (e) {
    console.error("ZainCash initiate error:", e);
    return NextResponse.json({ ok: false, error: "فشل تهيئة الدفع" }, { status: 500 });
  }
}
