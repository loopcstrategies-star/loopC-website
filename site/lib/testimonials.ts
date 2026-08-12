export type Testimonial = {
  name: string;
  role: string;
  company: string;
  quote: string;
  photoSrc?: string;
};

/** Genuine testimonials only. Empty until the company supplies real quotes. */
export const testimonials: Testimonial[] = [];
