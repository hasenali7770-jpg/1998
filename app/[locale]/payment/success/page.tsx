export default function PaymentSuccessPage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold">تمت العملية بنجاح ✅</h1>
      <p className="mt-3 text-muted-foreground">
        إذا كان الدفع ناجحاً، سيتم تفعيل الكورس تلقائياً على حسابك خلال لحظات.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        ملاحظة: الاعتماد النهائي يكون على إشعار الـ webhook من بوابة الدفع.
      </p>
    </main>
  );
}
