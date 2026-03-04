export type Locale = "ar" | "en";
export const locales: Locale[] = ["ar", "en"];
export function isLocale(x: string): x is Locale {
  return locales.includes(x as Locale);
}

export const dict = {
  ar: {
    brand: "Esraa Al-Noor",
    nav: {
      home: "الرئيسية",
      courses: "الدورات",
      pricing: "الأسعار",
      about: "من نحن",
      contact: "تواصل معنا",
      activate: "تفعيل",
      terms: "الشروط",
      privacy: "الخصوصية",
    },
    hero: {
      title: "رحلة وعي… بخطوات عملية",
      subtitle:
        "كورسات نفسية وتطوير ذات بطريقة منظمة وواضحة. تجربة مشاهدة مريحة، دعم عربي/إنكليزي، وتفعيل آمن عبر كود بعد الدفع.",
      ctaPrimary: "استعرض الدورات",
      ctaSecondary: "كيف يتم التفعيل؟",
    },
    featured: "الدورات المميزة",
    duration: "المدة",
    hours: "ساعة",
    buy: "اشترِ / فعّل",
    view: "عرض التفاصيل",
    pricingTitle: "خطط مرنة — تفتح كورس واحد",
    pricingNote: "الاشتراك يفتح كورس واحد فقط لمدة الاشتراك.",
    plans: {
      one: "شراء كورس واحد",
      monthly: "اشتراك شهري",
      semi: "اشتراك نصف سنوي",
      yearly: "اشتراك سنوي",
    },
    activation: {
      title: "تفعيل الوصول",
      subtitle:
        "بعد الدفع عبر Qi Card أو Zain Cash، سيتم إرسال كود تفعيل من الإدارة. أدخل الكود هنا لفتح الوصول.",
      label: "كود التفعيل",
      button: "تفعيل الآن",
      success:
        "تم إرسال طلب التفعيل. إذا كان الكود صحيحاً سيتم فتح الوصول بعد المراجعة اليدوية.",
      hint: "ملاحظة: التفعيل يدوي لضمان الأمان ومنع الاحتيال.",
    },
    coursesPage: {
      title: "الدورات",
      subtitle: "ابحث وفلتر الدورات واختر الأنسب لك.",
      search: "ابحث عن دورة…",
      filter: "فلترة حسب الوسوم",
      sort: "ترتيب",
      sortPriceAsc: "السعر: من الأقل للأعلى",
      sortPriceDesc: "السعر: من الأعلى للأقل",
      clear: "مسح",
      empty: "لا توجد نتائج مطابقة.",
    },
    testimonials: {
      title: "ماذا يقول المتابعون؟",
      items: [
        { name: "سارة", text: "أسلوب بسيط وواضح… حسّيت فعلاً بالتغيير خطوة بخطوة." },
        { name: "علي", text: "المحتوى مرتب وحلقات طويلة مفيدة، التجربة مريحة جداً." },
        { name: "نور", text: "أفضل شيء: التطبيق العملي والوضوح بدون تعقيد." },
      ],
    },
    contactTitle: "تواصل معنا",
    contactNote: "اختر الطريقة المناسبة للتواصل، أو اترك رسالة وسنرد عليك.",
    footer: {
      rights: "جميع الحقوق محفوظة ©",
      links: "روابط سريعة",
      follow: "تابعنا",
    },
    language: "اللغة",
    theme: "المظهر",
    light: "فاتح",
    dark: "داكن",
  },
  en: {
    brand: "Esraa Al-Noor",
    nav: {
      home: "Home",
      courses: "Courses",
      pricing: "Pricing",
      about: "About",
      contact: "Contact",
      activate: "Activate",
      terms: "Terms",
      privacy: "Privacy",
    },
    hero: {
      title: "A journey of awareness — with practical steps",
      subtitle:
        "Psychology-inspired & self-growth courses. Calm viewing experience, bilingual support, and secure manual activation via code.",
      ctaPrimary: "Browse courses",
      ctaSecondary: "How activation works",
    },
    featured: "Featured courses",
    duration: "Duration",
    hours: "hours",
    buy: "Buy / Activate",
    view: "View details",
    pricingTitle: "Flexible plans — unlock one course",
    pricingNote: "Subscription unlocks one course only for the duration.",
    plans: {
      one: "One-time course purchase",
      monthly: "Monthly subscription",
      semi: "Semi-annual subscription",
      yearly: "Yearly subscription",
    },
    activation: {
      title: "Activate access",
      subtitle:
        "After paying via Qi Card or Zain Cash, admin sends you an activation code. Enter it here to unlock access.",
      label: "Activation code",
      button: "Activate now",
      success:
        "Activation request sent. If the code is valid, access will be unlocked after manual review.",
      hint: "Note: manual activation improves security and reduces fraud.",
    },
    coursesPage: {
      title: "Courses",
      subtitle: "Search and filter courses, then pick what fits you.",
      search: "Search courses…",
      filter: "Filter by tags",
      sort: "Sort",
      sortPriceAsc: "Price: low to high",
      sortPriceDesc: "Price: high to low",
      clear: "Clear",
      empty: "No matching results.",
    },
    testimonials: {
      title: "What learners say",
      items: [
        { name: "Sara", text: "Simple and clear—real change, step by step." },
        { name: "Ali", text: "Well-structured long episodes. Super smooth experience." },
        { name: "Noor", text: "Best part: practical implementation without complexity." },
      ],
    },
    contactTitle: "Contact",
    contactNote: "Choose a channel or leave a message and we’ll reply.",
    footer: {
      rights: "All rights reserved ©",
      links: "Quick links",
      follow: "Follow",
    },
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
  },
} as const;

export function t<L extends Locale>(locale: L) {
  return dict[locale];
}
