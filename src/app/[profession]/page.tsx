import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfessionLanding } from "@/components/profession-landing";
import {
  getAllProfessionSlugs,
  getProfessionBySlug,
} from "@/config/professions";
import { getSiteUrl } from "@/config/site";

type PageProps = {
  params: Promise<{ profession: string }>;
};

export async function generateStaticParams() {
  return getAllProfessionSlugs().map((profession) => ({ profession }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { profession: slug } = await params;
  const profession = getProfessionBySlug(slug);
  if (!profession) return {};

  const url = `${getSiteUrl()}/${profession.slug}`;

  return {
    title: profession.metaTitle,
    description: profession.metaDescription,
    keywords: profession.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: profession.metaTitle,
      description: profession.metaDescription,
      url,
      type: "website",
    },
  };
}

export default async function ProfessionPage({ params }: PageProps) {
  const { profession: slug } = await params;
  const profession = getProfessionBySlug(slug);

  if (!profession) notFound();

  return <ProfessionLanding profession={profession} />;
}
