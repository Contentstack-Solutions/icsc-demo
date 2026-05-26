import { cache } from "react";
import { headers } from "next/headers";
import "./globals.css";
import ContentstackServer from "@/lib/cstack";
import { PersonalizeProvider } from "@/context/personalize.context";
import { LyticsTracking } from "@/context/lyticsTracking";
import { AuthProvider } from "@/context/auth.context";



export const generateMetadata = async ({ params }) => {
  const { locale } = await params;

  return {
    title: "ICSC Demo",
    description: "An ICSC demo showcasing personalization with Contentstack and Lytics",
    robots: {
      index: false,
      follow: false,
    }
  }
};

export default async function RootLayout({
  children,
  params,
}) {
  const { locale } = await params;
  
  return (
    <html lang={locale}>
      <body
      >
        {process.env.LYTICS_TAG && <LyticsTracking />}
        <AuthProvider>
          {process.env.CONTENTSTACK_PERSONALIZATION ? <PersonalizeProvider>
            {children}
          </PersonalizeProvider> : <>{children}</>}
        </AuthProvider>
      </body>
    </html>
  );
}
