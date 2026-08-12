export type Project = {
  slug: string;
  title: string;
  sector: string;
  summary: string;
  challenge: string;
  approach: string;
  product: string;
  technology: string[];
  result: string;
  galleryNote: string;
  href: string;
};

export const projects: Project[] = [
  {
    slug: "coacher-max",
    title: "Coacher Max",
    sector: "Education",
    summary:
      "A live multi-tenant platform for tuition centres — mobile apps for parents and staff, plus an admin dashboard for centre operations.",
    challenge:
      "Tuition centres were running attendance, fees, schedules and parent communication across spreadsheets and chat groups. Owners could not see a centre clearly without calling staff. Parents had no reliable channel besides a personal phone number.",
    approach:
      "LoopC mapped centre workflows end to end — enquiry, admission, batches, attendance, fee cycles, announcements and staff roles. We designed a multi-tenant architecture so each centre keeps isolated data while sharing product upgrades. Flutter for parent and staff apps, a NestJS API, PostgreSQL, and a Next.js admin dashboard for centre owners.",
    product:
      "A production SaaS product: iOS and Android apps for parents and teachers, an admin dashboard for centre management, payments, role-based access, announcements, scheduling, attendance and reporting. LoopC owns the product and continues to develop it.",
    technology: ["Flutter", "NestJS", "PostgreSQL", "Next.js"],
    result:
      "Centres that use Coacher Max run admissions, attendance, fees and parent communication in one system instead of a mix of files and chat. We do not publish performance metrics here. If you run a similar operation, we can walk through the product and whether it fits.",
    galleryNote:
      "Product screens are available in a conversation. This page does not use stock photography as if it were a client screenshot.",
    href: "/work/coacher-max",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
