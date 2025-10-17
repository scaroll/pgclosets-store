import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Family-Owned Excellence Since 2010 | PG Closets Ottawa",
  description:
    "Learn about PG Closets - Ottawa's trusted family-owned closet door specialists since 2010. Official Renin dealer serving 500+ families with premium door systems and professional installation.",
  keywords:
    "PG Closets about, family-owned Ottawa, Renin dealer Ottawa, closet door specialists, professional installation Ottawa, premium door systems",
  openGraph: {
    title: "About PG Closets - Family-Owned Excellence Since 2010",
    description:
      "Ottawa's premier closet door specialists transforming homes with premium Renin solutions since 2010. Family-owned, locally operated, 500+ installations.",
    type: "website",
    url: "https://pgclosets.com/about",
    locale: "en_CA",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
