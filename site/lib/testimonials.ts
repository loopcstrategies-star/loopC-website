/** Placeholder testimonials — replace copy and images with real clients when available. */

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Unsplash or local public path */
  imageSrc: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "LoopC cut our fee-collection follow-ups by half within a month. They understood our center workflow before proposing anything.",
    name: "Ananya Krishnan",
    role: "Center Director",
    company: "Tuition network, Chennai",
    imageSrc:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=88",
  },
  {
    id: "2",
    quote:
      "Finally a team that didn't sell shelf-ware. They scoped only what we needed — a web dashboard, not a bloated ERP quote.",
    name: "Rahul Venkat",
    role: "Founder",
    company: "B2B services startup",
    imageSrc:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&q=88",
  },
  {
    id: "3",
    quote:
      "Weekly demos kept leadership aligned. We went live on one branch first, then scaled — exactly how they said it would work.",
    name: "Meera Subramanian",
    role: "Operations Head",
    company: "Multi-branch operator",
    imageSrc:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=88",
  },
];
