# Esraa Al-Noor Academy — Platform (V3)

منصة كورسات مبنية على:
- **Next.js 14 (App Router)** + **TypeScript** + **Tailwind**
- **Supabase** (Auth + Storage) + **Postgres**
- **Prisma ORM** (Schema + Types + Migrations)
- بوابات الدفع:
  - **ZainCash** 
  - **QiCard Payment Gateway** 
  - **Stripe** (اختياري/للبطاقات الدولية)

> ملاحظة: الدفع يحتاج بيانات تاجر (Credentials) من مزودات الدفع، لذلك وضعت الهيكل كامل + endpoints جاهزة، وتضيف مفاتيحك داخل `.env`.

---

## 1) تشغيل محلياً

### المتطلبات
- Node.js 18+
- قاعدة بيانات Postgres (يفضل Supabase)

### الإعداد
```bash
npm install
cp .env.example .env
```

ضع قيم Supabase + DB داخل `.env`.

### Prisma
```bash
npx prisma generate --schema=./schema.prisma
# لإنشاء الجداول (بعد ضبط DATABASE_URL/DIRECT_URL)
npx prisma migrate dev --name init --schema=./schema.prisma
```

### تشغيل
```bash
npm run dev
```
ثم افتح:
- http://localhost:3000

---

## 2) الهيكل العام (مختصر)

### قاعدة البيانات (Prisma)
- Users / Courses / Modules / Lessons / Enrollments / Orders / Payments  
تعريفها في: `schema.prisma`

### Supabase
- `lib/supabase/server.ts` (سيرفر + cookies)
- `lib/supabase/browser.ts` (براوزر)

### الدفع
- إنشاء Order: `POST /api/orders`
- ZainCash:
  - `POST /api/payments/zaincash/initiate`
  - `GET  /api/payments/zaincash/callback` (JWT token verify)
  - `POST /api/payments/zaincash/webhook`
- QiCard:
  - `POST /api/payments/qicard/initiate`
  - `POST /api/payments/qicard/webhook`
- Stripe:
  - `POST /api/payments/stripe/checkout`
  - `POST /api/payments/stripe/webhook`

صفحات النجاح/الفشل:
- `/{locale}/payment/success`
- `/{locale}/payment/failed`

---

## 3) النشر على Vercel + ربط دومين
- ارفع المشروع على GitHub
- اربطه بـ Vercel
- انسخ متغيرات `.env` إلى Environment Variables في Vercel
- اربط الدومين من إعدادات Vercel Domains
- SSL يتفعل تلقائيًا

---

## 4) ملاحظات مهمة
- الأسعار داخل الـ DB مخزنة كـ **IQD integer** لتجنب مشاكل الـ floating.
- الفيديوهات: الأفضل لاحقاً نقلها إلى مزود Streaming (Mux/Cloudflare Stream) إذا زاد الحمل.
- صلاحيات الأدمن: تعتمد على `User.role` داخل قاعدة البيانات.

---

## 5) TODO (الواجهة)
الـ UI الحالي موجود، لكن تحويله بالكامل ليقرأ من DB ويضيف لوحة تحكم كاملة يحتاج شغل إضافي:
- Admin dashboard لإدارة الكورسات/الحلقات
- صفحة checkout UI تربط `/api/orders` ثم initiate حسب provider
- صفحة تسجيل/دخول عبر Supabase Auth
