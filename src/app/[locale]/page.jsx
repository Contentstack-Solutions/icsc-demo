
"use client";
import { useDataContext } from "@/context/data.context";
import { ContentstackClient } from "@/lib/contentstack-client";
import ContentstackServer from "@/lib/cstack";
import { useState, useEffect, use } from "react";
import { useAuth } from "@/context/auth.context";
import HeroBanner from "@/components/HeroBanner";
import PropertiesGrid from "@/components/PropertiesGrid";
export default function Home({ params }) {
  const { locale } = use(params);
  const initialData = useDataContext();
  const { lyticsProfileData } = useAuth();
  const lyticsUser = lyticsProfileData?.data?.user;

  const [entry, setEntry] = useState(null);
  console.log("🚀 ~ Home ~ entry:", entry?.title)

  useEffect(() => {
    const fetchData = async () => {
      const data = await ContentstackClient.getElementByUrlWithRefs("homepage", `/`, locale, [
        "hero_banner"
      ] );
      if(data) {
        setEntry(data[0]);
      } else {
        setEntry(null);
      }
    }

    fetchData();
    ContentstackClient.onEntryChange(fetchData);
  }, [locale, initialData])

  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      if (!jstag) return;
      // console.info("User is leaving the page, sending Lytics event for video views ");
      jstag.send({
        "initial_video_attributes": "false"
      });
    });
  }, []);

  const resetVideoViews = () => {
    if (!jstag) return;
    jstag.send({
      "initial_video_attributes": "true"
    });
    // reload so lyticsUser reflects the updated attribute
    window.location.href = `/${locale}`;
  };

  return (
    <div className="min-h-screen bg-white p-8">
      {(entry?.vimeo_video_id && lyticsUser?.initial_video_attributes) ? (
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <iframe
              src={`https://player.vimeo.com/video/${entry?.vimeo_video_id}?autoplay=0&title=0&byline=0&portrait=0`}
              className="absolute inset-0 w-full h-full rounded-xl"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="ICSC Video"
            />
          </div>
        </div>
      ) : (
        <HeroBanner entry={entry?.hero_banner?.[0]} />
      )}
      <PropertiesGrid locale={locale} entry={entry?.properties_section} />

      {/* Reset video demo — fixed to bottom-right corner */}
      {entry?.vimeo_video_id && (
        <button
          onClick={resetVideoViews}
          className="fixed bottom-20 right-8 z-50 flex items-center gap-2 px-4 py-2.5 bg-gray-900/80 hover:bg-gray-900 text-white text-xs font-medium rounded-full shadow-lg backdrop-blur-sm transition-colors"
          title="Reset video demo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H5.498a.75.75 0 0 0-.75.75v3.268a.75.75 0 0 0 1.5 0v-1.57l.318.317a7 7 0 0 0 11.713-3.138.75.75 0 0 0-1.467-.323ZM4.688 8.576a5.5 5.5 0 0 1 9.2-2.466l.312.311H11.77a.75.75 0 0 0 0 1.5h3.234a.75.75 0 0 0 .75-.75V3.903a.75.75 0 0 0-1.5 0v1.57l-.317-.316a7 7 0 0 0-11.713 3.137.75.75 0 0 0 1.467.323Z" clipRule="evenodd" />
          </svg>
          Reset Video Views
        </button>
      )}
    </div>
  );
}

