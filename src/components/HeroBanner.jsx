"use client";

const ALIGN_CLASS = {
  Left:   "items-start text-left",
  Center: "items-center text-center",
  Right:  "items-end text-right",
};

export default function HeroBanner({ entry }) {
  if (!entry) return null;

  const title    = entry.title ?? "";
  const desc     = entry.description ?? "";
  const bgImage  = entry.backgound_image?.url ?? null; // note: typo is in CMS field name
  const align    = entry.text_align ?? "Left";
  const ctaText  = entry.cta?.text ?? "";
  const ctaHref  = entry.cta?.external_link || entry.cta?.internal_link?.[0]?.url || "#";

  const alignClass = ALIGN_CLASS[align] ?? ALIGN_CLASS.Left;

  return (
    <section className="w-full overflow-hidden">
      <div className="relative w-full flex items-end" style={{ minHeight: 400 }}
        {...(entry?.$?.backgound_image ?? {})}
      >

        {/* Background image */}
        {bgImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bgImage}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-700" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

        {/* Content */}
        <div className={`relative z-10 w-full flex flex-col gap-4 px-10 py-10 ${alignClass}`}>
          {title && (
            <h1
              {...(entry.$?.title ?? {})}
              className="text-white text-3xl font-bold leading-snug max-w-2xl drop-shadow"
            >
              {title}
            </h1>
          )}

          {desc && (
            <p
              {...(entry.$?.description ?? {})}
              className="text-white/80 text-base max-w-xl"
            >
              {desc}
            </p>
          )}

          {ctaText && (
            <a
              href={ctaHref}
              className="px-7 py-3 bg-[#246EFF] hover:bg-blue-700 text-white text-sm font-semibold rounded transition-colors w-fit"
              {...(entry?.cta?.internal_link?.[0]?.url ? {...(entry?.cta?.$?.internal_link ?? {})} : {...(entry?.cta?.$?.external_link ?? {})})}
            >
              <span
                {...(entry?.cta?.$?.text ?? {})}
              >
                {ctaText}
              </span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
