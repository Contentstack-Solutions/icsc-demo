"use client";
import { useDataContext } from "@/context/data.context";
import { ContentstackClient } from "@/lib/contentstack-client";
import { useState, useEffect, use } from "react";
import EventsPage from "@/components/EventsPage";

export default function Page({ params }) {
  const { locale, slug } = use(params);
  const initialData = useDataContext();

  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (slug === "events") {
        const data = await ContentstackClient.getElementByUrlWithRefs(
          "events_page",
          `/page/events`,
          locale,
          ["events"]
        );
        setEntry(data ? data[0] : null);
      } else {
        const data = await ContentstackClient.getElementByUrl("page", `/page/${slug}`, locale);
        setEntry(data ? data[0] : null);
      }
    };

    fetchData();
    ContentstackClient.onEntryChange(fetchData);
  }, [locale, slug, initialData]);

  if (slug === "events") {
    return <EventsPage entry={entry} />;
  }

  if (!entry) {
    return (
      <div className="pt-[300px] flex flex-col items-center justify-center">
        <h1 className="text-4xl text-[#246EFF]">404</h1>
        <h2 className="text-2xl font-thin">Page not found</h2>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl text-[#246EFF]">{entry.title}</h1>
      </div>
    </div>
  );
}
