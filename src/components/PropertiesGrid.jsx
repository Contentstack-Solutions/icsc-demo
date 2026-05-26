"use client";

import { useState, useEffect } from "react";
import { StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { ContentstackClient } from "@/lib/contentstack-client";


function formatSqFt(n) {
  if (!n) return null;
  return Number(n).toLocaleString() + " sq ft";
}

// Map user property_types labels → taxonomy term_uids
const LABEL_TO_TERM = {
  "Suburban Mall": "suburban_mall",
  "Airport":       "airport",
  "Urban Locale":  "urban_locale",
};

function PropertyCard({ property, saved, onToggleSave }) {
  const image     = property.featured_image?.url;
  const sqFt      = formatSqFt(property.square_feet);

  return (
    <div className="bg-white border border-gray-200 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-40 bg-gray-100 shrink-0">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={property.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No image</div>
        )}
        {property?.taxonomies?.length > 0 && (
          property.taxonomies.map((t) => (
            <span key={t.term_uid} className="absolute top-2 right-2 capitalize bg-blue-100 border border-blue-200 px-2 py-1 text-[9px] font-medium rounded-full">
            {t.term_uid?.replace(/_/g, " ")}
            </span>
          ))
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 px-4 pt-3 pb-4 gap-1">
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-1" title={property.title}>
          {property.title}
        </h3>
        <p className="text-gray-600 text-xs line-clamp-1" title={property.full_address}>
          {property.full_address}
        </p>

        <div className="mt-2 space-y-0.5">
          {property.service_category && (
            <p className="text-gray-500 text-xs">{property.service_category}</p>
          )}
          {property.community_type && (
            <p className="text-gray-500 text-xs">{property.community_type}</p>
          )}
          {property.neighborhood_type && (
            <p className="text-gray-500 text-xs">{property.neighborhood_type}</p>
          )}
          {sqFt && (
            <p className="text-gray-500 text-xs">{sqFt}</p>
          )}
        </div>

        {/* Footer */}
        {/* <div className="mt-auto pt-3 flex items-center justify-end">
          <button
            onClick={() => onToggleSave(property.uid)}
            className="text-gray-400 hover:text-blue-600 transition-colors"
            aria-label={saved ? "Unsave property" : "Save property"}
          >
            {saved
              ? <StarSolid className="w-5 h-5 text-blue-600" />
              : <StarIcon className="w-5 h-5" />
            }
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default function PropertiesGrid({ locale, entry, user }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [saved, setSaved]           = useState([]);

  const sectionTitle     = entry?.title ?? "";
  const tabs             = entry?.tabs ?? [];
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (tabs.length > 0) {
      setActiveTab(tabs[0].listing_type);
    }
  }, [entry]);

  // Load saved UIDs from localStorage
  useEffect(() => {
    try {
      setSaved(JSON.parse(localStorage.getItem("icsc_saved_properties") || "[]"));
    } catch { setSaved([]); }
  }, []);


  // Fetch all properties
  useEffect(() => {
    ContentstackClient.getElementByType("properties", locale)
      .then((data) => setProperties(Array.isArray(data) ? data : []))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, [locale]);

  useEffect(() => {
    // console.log("🚀 ~ PropertiesGrid ~ properties:", properties)
  }, [properties, user])

  const toggleSave = (uid) => {
    setSaved((prev) => {
      const next = prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid];
      localStorage.setItem("icsc_saved_properties", JSON.stringify(next));
      return next;
    });
  };

  // Derive user's preferred taxonomy terms from their registered property_types
  const userTerms = (user?.property_type ?? [])
    .map((label) => LABEL_TO_TERM[label])
    .filter(Boolean);

  const visibleProperties = (() => {
    // if (activeTab === "saved") {
    //   return properties.filter((p) => saved.includes(p.uid));
    // }
    if (activeTab === "profile-attributes") {
      if (userTerms.length > 0) {
        const filteredProperties = properties.filter((p) =>
          p.taxonomies?.some((t) => userTerms.includes(t.term_uid))
        );
        return filteredProperties;
      }
    }
    return properties;
  })();

  return (
    <section className="px-6 py-8">
      <h2
        {...(entry?.$?.title ?? {})}
        className="text-xl font-bold text-gray-900 mb-4"
      >
        {sectionTitle}
      </h2>

      {/* Dynamic tabs from Contentstack */}
      {tabs?.length > 0 && (
        <div className="flex items-center border-b border-gray-200 mb-6 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab._metadata?.uid ?? tab.listing_type}
              onClick={() => setActiveTab(tab.listing_type)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.listing_type
                  ? "border-[#246EFF] text-[#246EFF]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
              {...(tab.$?.label ?? {})}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-[#246EFF]" />
        </div>
      )}

      {!loading && visibleProperties?.length === 0 && (
        <div className="text-center py-16 text-gray-400 text-sm">
          No properties found.
        </div>
      )}

      {!loading && visibleProperties?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleProperties.map((property) => (
            <PropertyCard
              key={property.uid}
              property={property}
              saved={saved.includes(property.uid)}
              onToggleSave={toggleSave}
            />
          ))}
        </div>
      )}
    </section>
  );
}
