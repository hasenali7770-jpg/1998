"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Container } from "@/components/Container";

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Add this for displaying errors
  
  const params = useParams();
  const locale = params.locale || 'en';

  const handleLogin = () => {
    if (password === "israa2026") {
      setIsAuthorized(true);
      setErrorMessage("");
    } else {
      alert("كلمة السر خاطئة يا بطل!");
    }
  };

  const handleAddCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const courseData = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: formData.get("price"),
      videoUrl: formData.get("videoUrl"),
      image: "/placeholder.png",
    };

    console.log("📤 Sending data:", courseData); // Log the data being sent

    try {
      const response = await fetch(`/${locale}/api/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData),
      });

      console.log("📥 Response status:", response.status); // Log response status

      // Try to get the response body
      let responseData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }
      
      console.log("📦 Response data:", responseData);

      if (response.ok) {
        alert("تم نشر الكورس بنجاح في الأكاديمية! 🎉");
        (e.target as HTMLFormElement).reset();
      } else {
        // Show detailed error
        const errorMsg = typeof responseData === 'string' 
          ? responseData 
          : responseData.error || 'فشل النشر، تأكد من إعدادات قاعدة البيانات';
        
        setErrorMessage(errorMsg);
        alert(`خطأ: ${errorMsg}`);
      }
    } catch (error) {
      console.error("🔥 Network/Parse Error:", error);
      setErrorMessage(error instanceof Error ? error.message : 'حدث خطأ في الاتصال');
      alert("حدث خطأ في الاتصال بالسيرفر: " + (error instanceof Error ? error.message : 'خطأ غير معروف'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <Container className="py-20 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6">لوحة تحكم الأكاديمية</h1>
        <input 
          type="password" 
          placeholder="أدخل كلمة السر" 
          className="border p-3 rounded-xl mb-4 w-64 text-center focus:ring-2 focus:ring-brand outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} className="bg-brand text-white px-10 py-3 rounded-2xl font-bold hover:opacity-90 transition">
          دخول
        </button>
      </Container>
    );
  }

  return (
    <Container className="py-14">
      <h1 className="text-3xl font-bold mb-8 text-ink dark:text-night-text">إدارة الأكاديمية 🚀</h1>
      
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <strong>خطأ:</strong> {errorMessage}
        </div>
      )}
      
      <div className="grid gap-8 md:grid-cols-2">
        {/* نموذج إضافة كورس جديد */}
        <div className="bg-white dark:bg-night-surface p-8 rounded-[2rem] border border-stroke shadow-soft">
          <h2 className="text-xl font-semibold mb-6">إنشاء كورس جديد</h2>
          <form className="space-y-4" onSubmit={handleAddCourse}>
            <input name="title" type="text" placeholder="اسم الكورس" className="w-full p-3 rounded-xl border border-stroke dark:bg-night-bg outline-none focus:border-brand" required />
            <input name="price" type="number" placeholder="السعر (د.ع)" className="w-full p-3 rounded-xl border border-stroke dark:bg-night-bg outline-none focus:border-brand" required />
            <textarea name="description" placeholder="وصف الكورس" className="w-full p-3 rounded-xl border border-stroke dark:bg-night-bg h-32 outline-none focus:border-brand" required></textarea>
            <input name="videoUrl" type="text" placeholder="رابط الفيديو (Bunny.net أو YouTube)" className="w-full p-3 rounded-xl border border-stroke dark:bg-night-bg outline-none focus:border-brand" />
            
            <div className="border-2 border-dashed border-stroke p-6 rounded-xl text-center bg-bg/50 dark:bg-night-bg/50">
              <p className="text-sm text-muted mb-2">صورة الغلاف (Image)</p>
              <input type="file" className="text-xs" disabled />
              <p className="text-[10px] text-accent mt-2">ميزة رفع الصور ستُفعل قريباً في المرحلة الثالثة</p>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-bold text-white transition ${isLoading ? 'bg-muted cursor-not-allowed' : 'bg-brand hover:opacity-90 shadow-soft'}`}
            >
              {isLoading ? "جاري النشر..." : "نشر الكورس في الأكاديمية"}
            </button>
          </form>
        </div>

        {/* نموذج تعديل نصوص الموقع */}
        <div className="bg-white dark:bg-night-surface p-8 rounded-[2rem] border border-stroke shadow-soft opacity-60 pointer-events-none">
          <h2 className="text-xl font-semibold mb-6">تعديل نصوص الموقع (قريباً)</h2>
          <form className="space-y-4">
            <div>
              <label className="text-xs font-bold mb-2 block">عنوان البطولة (Hero Title)</label>
              <input type="text" disabled className="w-full p-3 rounded-xl border border-stroke dark:bg-night-bg" />
            </div>
            <button disabled className="w-full bg-ink text-white py-4 rounded-2xl font-bold">تحديث النصوص</button>
          </form>
        </div>
      </div>
    </Container>
  );
}
