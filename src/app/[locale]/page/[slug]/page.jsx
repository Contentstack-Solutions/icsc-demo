"use client";
import { useDataContext } from "@/context/data.context";
import { ContentstackClient } from "@/lib/contentstack-client";
import { useState, useEffect, use } from "react";

export default function Page({ params }) {
  const { locale } = use(params);
  const initialData = useDataContext();
  const {slug} = params;

  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // example of how to fetch data from contentstack, replace "homepage" with the content type you want to fetch
      const data = await ContentstackClient.getElementByUrl("page", `/page/${slug}`, locale);
      if(data) {
        setEntry(data[0]);
      } else {
        setEntry(null);
      }
    }

    ContentstackClient.onEntryChange(fetchData);
  }, [locale, initialData])

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
