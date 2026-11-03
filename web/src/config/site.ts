/**
 * Central site configuration.
 *
 * SITE_URL — defaults to the BLIEVE domain used for all contact emails.
 * Override with the environment variable NEXT_PUBLIC_SITE_URL when the
 * production deployment domain differs. Used for canonical URLs, Open Graph
 * metadata, the sitemap and robots.txt.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blieve.in";

export const SITE_NAME = "BLIEVE";
export const SITE_TAGLINE = "Where belief becomes business.";
export const INSTITUTION = "Aditya College of Engineering and Technology";
export const INSTITUTION_SHORT = "ACET";
export const INSTITUTION_LOCATION = "Bengaluru";
export const INSTITUTION_URL = "https://www.acetedu.net";
export const ACADEMIC_YEAR = "2026\u201327";
export const HASHTAG = "#BLIEVE100";
