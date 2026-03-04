"use client";

import { useMemo, useState, useEffect } from "react";
import { Container } from "@/components/Container";
import { Locale, isLocale, t } from "@/lib/i18n";
import { courses as localCourses } from "@/lib/courses";
import { CourseCard } from "@/components/CourseCard";

// Database course type
interface DBCourse {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string | null;
  videoUrl: string | null;
  createdAt: string;
}

export default function CoursesPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : "ar") as Locale;
  const tr = t(locale);

  const [dbCourses, setDbCourses] = useState<DBCourse[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch courses from database
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`/${locale}/api/courses`);
        const data = await response.json();
        setDbCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [locale]);

  // Convert database courses to match CourseCard format
  const dbTransformed = useMemo(() => {
    return dbCourses.map(course => ({
      slug: `db-${course.id}`,
      cover: course.image || '/course-covers/default.svg',
      title: { ar: course.title, en: course.title },
      short: { 
        ar: course.description.substring(0, 100) + (course.description.length > 100 ? '...' : ''), 
        en: course.description.substring(0, 100) + (course.description.length > 100 ? '...' : '')
      },
      priceIQD: course.price,
      hoursMin: 10,
      tags: { ar: [], en: [] }
    }));
  }, [dbCourses]);

  // Combine local and database courses
  const allCourses = useMemo(() => {
    return [...localCourses, ...dbTransformed];
  }, [localCourses, dbTransformed]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    allCourses.forEach((c) => c.tags[locale].forEach((tag) => set.add(tag)));
    return Array.from(set);
  }, [allCourses, locale]);

  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [sort, setSort] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = allCourses
      .filter((c) => {
        const title = c.title[locale].toLowerCase();
        const short = c.short[locale].toLowerCase();
        const matchQ = !query || title.includes(query) || short.includes(query);
        const matchTag = !tag || c.tags[locale].includes(tag);
        return matchQ && matchTag;
      })
      .slice()
      .sort((a, b) => (sort === "asc" ? a.priceIQD - b.priceIQD : b.priceIQD - a.priceIQD));
    return list;
  }, [allCourses, q, tag, sort, locale]);

  if (loading) {
    return (
      <Container className="py-10">
        <div>جاري التحميل...</div>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      {/* Rest of your JSX remains exactly the same */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink dark:text-night-text">{tr.coursesPage.title}</h1>
        <p className="mt-2 text-sm leading-7 text-muted dark:text-night-muted">{tr.coursesPage.subtitle}</p>
      </div>

      {/* Search and filter section - same as before */}
      <div className="mb-6 grid gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={tr.coursesPage.search}
            className="w-full rounded-2xl border border-stroke bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand/20 dark:border-night-stroke dark:bg-night-surface dark:text-night-text"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="w-full rounded-2xl border border-stroke bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand/20 dark:border-night-stroke dark:bg-night-surface dark:text-night-text"
          >
            <option value="asc">{tr.coursesPage.sortPriceAsc}</option>
            <option value="desc">{tr.coursesPage.sortPriceDesc}</option>
          </select>
          <button
            onClick={() => {
              setQ("");
              setTag(null);
              setSort("asc");
            }}
            className="shrink-0 rounded-2xl bg-bg px-4 py-3 text-sm font-semibold text-ink transition hover:opacity-90 dark:bg-night-bg dark:text-night-text"
          >
            {tr.coursesPage.clear}
          </button>
        </div>
      </div>

      {/* Tags filter - same as before */}
      <div className="mb-6 rounded-3xl border border-stroke bg-white p-5 shadow-soft dark:border-night-stroke dark:bg-night-surface">
        <div className="text-sm font-semibold text-ink dark:text-night-text">{tr.coursesPage.filter}</div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setTag(null)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              tag === null
                ? "bg-brand text-white"
                : "bg-bg text-ink hover:opacity-90 dark:bg-night-bg dark:text-night-text"
            }`}
          >
            {locale === "ar" ? "الكل" : "All"}
          </button>
          {allTags.map((tTag) => (
            <button
              key={tTag}
              onClick={() => setTag(tTag)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                tag === tTag
                  ? "bg-brand text-white"
                  : "bg-bg text-ink hover:opacity-90 dark:bg-night-bg dark:text-night-text"
              }`}
            >
              {tTag}
            </button>
          ))}
        </div>
      </div>

      {/* Courses grid - same as before */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-stroke bg-white p-6 text-sm text-muted shadow-soft dark:border-night-stroke dark:bg-night-surface dark:text-night-muted">
          {tr.coursesPage.empty}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CourseCard key={c.slug} course={c} locale={locale} />
          ))}
        </div>
      )}
    </Container>
  );
}
