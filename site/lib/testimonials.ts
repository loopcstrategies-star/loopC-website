/** Client testimonials — replace with real quotes when available. */

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  imageSrc: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "LoopC understood our workflow before writing a line of code. The web dashboard and mobile app feel built for how we actually operate — not a generic template.",
    name: "Ananya Krishnan",
    role: "Center Director",
    company: "Education network, Chennai",
    imageSrc:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=88",
  },
  {
    id: "2",
    quote:
      "We needed custom software, not shelf-ware. They scoped only what we needed, tested thoroughly, and delivered a system our team adopted in the first week.",
    name: "Rahul Venkat",
    role: "Founder",
    company: "B2B services startup",
    imageSrc:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&q=88",
  },
  {
    id: "3",
    quote:
      "LoopC ERP connected sales, inventory and finance in one place. Weekly demos kept leadership aligned — we went live on one branch, then scaled.",
    name: "Meera Subramanian",
    role: "Operations Head",
    company: "Multi-branch trading company",
    imageSrc:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=88",
  },
  {
    id: "4",
    quote:
      "Professional, reliable and business-focused. One team handled design, development, testing and support — we never felt passed between vendors.",
    name: "David Thomas",
    role: "CEO",
    company: "Retail services group",
    imageSrc:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=88",
  },
];
