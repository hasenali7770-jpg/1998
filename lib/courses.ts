export type Course = {
  slug: string;
  cover: string;
  title: { ar: string; en: string };
  short: { ar: string; en: string };
  priceIQD: number;
  hoursMin: number;
  tags: { ar: string[]; en: string[] };
};

export const courses: Course[] = [
  {
    slug: "work-money-foundations",
    cover: "/course-covers/work-money-foundations.svg",
    title: { ar: "أسس العمل والمال", en: "Work & Money Foundations" },
    short: {
      ar: "تبني قاعدة واضحة لعلاقتك بالعمل والمال وتحوّلها لنظام عملي.",
      en: "Build a clear foundation for your relationship with work and money—practical and actionable.",
    },
    priceIQD: 500000,
    hoursMin: 10,
    tags: { ar: ["العمل", "المال", "نظام"], en: ["Work", "Money", "Systems"] },
  },
  {
    slug: "psychology-male-female",
    cover: "/course-covers/psychology-male-female.svg",
    title: { ar: "سيكولوجية الذكر والأنثى", en: "Male & Female Psychology" },
    short: {
      ar: "فهم أعمق للفروق النفسية وبناء تواصل صحي ومتوازن.",
      en: "A deeper understanding of psychological differences and healthier communication.",
    },
    priceIQD: 500000,
    hoursMin: 10,
    tags: { ar: ["علاقات", "تواصل", "وعي"], en: ["Relationships", "Communication", "Awareness"] },
  },
  {
    slug: "achieve-goals",
    cover: "/course-covers/achieve-goals.svg",
    title: { ar: "تحقيق الأهداف", en: "Goal Achievement" },
    short: {
      ar: "خطة واضحة لإدارة الوقت، العادات، والتحفيز للوصول للنتائج.",
      en: "A clear plan to manage time, habits, and motivation to reach results.",
    },
    priceIQD: 500000,
    hoursMin: 10,
    tags: { ar: ["أهداف", "عادات", "تركيز"], en: ["Goals", "Habits", "Focus"] },
  },
  {
    slug: "success-foundations",
    cover: "/course-covers/success-foundations.svg",
    title: { ar: "أسس النجاح", en: "Foundations of Success" },
    short: {
      ar: "أساسيات النجاح الواقعي: ذهن، مشاعر، انضباط، وتطبيق يومي.",
      en: "Real-world success basics: mindset, emotions, discipline, and daily practice.",
    },
    priceIQD: 500000,
    hoursMin: 10,
    tags: { ar: ["نجاح", "انضباط", "تطوير"], en: ["Success", "Discipline", "Growth"] },
  },
  {
    slug: "women-lock",
    cover: "/course-covers/women-lock.svg",
    title: { ar: "قفل المرأة", en: "The Woman’s Lock" },
    short: {
      ar: "تفكيك القيود الداخلية وبناء ثقة وحدود صحية بصورة عملية.",
      en: "Unpack inner constraints and build confidence and healthy boundaries—practically.",
    },
    priceIQD: 500000,
    hoursMin: 10,
    tags: { ar: ["ثقة", "حدود", "تمكين"], en: ["Confidence", "Boundaries", "Empowerment"] },
  },
];

export function formatIQD(iqd: number, locale: "ar" | "en") {
  const formatted = new Intl.NumberFormat(locale === "ar" ? "ar-IQ" : "en-US").format(iqd);
  return locale === "ar" ? `د.ع ${formatted}` : `IQD ${formatted}`;
}
