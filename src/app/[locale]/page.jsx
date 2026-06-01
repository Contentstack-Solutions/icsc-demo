
"use client";
import { useDataContext } from "@/context/data.context";
import { ContentstackClient } from "@/lib/contentstack-client";
import ContentstackServer from "@/lib/cstack";
import { useState, useEffect, useRef, use } from "react";
import HeroBanner from "@/components/HeroBanner";
import PropertiesGrid from "@/components/PropertiesGrid";
export default function Home({ params }) {
  const { locale } = use(params);
  const initialData = useDataContext();
  const [lyticsUser, setLyticsUser] = useState(null);

  const [entry, setEntry] = useState(null);
  const resetViewsRef = useRef(false);

  useEffect(() => {
    jstag.call('entityReady', (profile) => {
        setLyticsUser(profile?.data?.user);
    });
  }, []);
  
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
    const handleBeforeUnload = () => {
      if (!jstag) return;
      console.log(resetViewsRef.current)
      if (resetViewsRef.current) {
        console.info("Unload event triggered, and video views reset to true.");
        jstag.send({ "initial_video_attributes": "true" });
      } else {
        console.info("User is leaving the page, sending Lytics event for video views.");
        jstag.send({ "initial_video_attributes": "false" });
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const resetVideoViews = () => {
    // console.info("============ Reset video views button clicked. ===============");
    resetViewsRef.current = true;
    window.location.href = `/${locale}`;
  };

  return (
    <div className="min-h-screen bg-white p-8">
      {(entry?.vimeo_video_id && lyticsUser?.initial_video_attributes) ? (
        <div className="max-w-5xl mx-auto px-6 py-12" {...(entry?.$?.vimeo_video_id ?? {})}>
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
        <div {...(entry?.$?.hero_banner ?? {})}>
          <HeroBanner entry={entry?.hero_banner?.[0]} />
        </div>
      )}
      <div {...(entry?.$?.properties_section ?? {})}>
        <PropertiesGrid locale={locale} entry={entry?.properties_section} user={lyticsUser} />
      </div>

      {/* Reset video demo — fixed to bottom-right corner */}
      {entry?.vimeo_video_id && (
        <button
          onClick={resetVideoViews}
          className="fixed bottom-20 right-8 z-50 flex items-center gap-2 px-4 py-2.5 bg-gray-900/80 hover:bg-gray-900 text-white text-xs font-medium rounded-full shadow-lg backdrop-blur-sm hover:cursor-pointer transition-opacity opacity-100 hover:opacity-90"
          title="Reset video demo"
          // ref={resetViewsRef}
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

