/** Banner images for inner pages (Unsplash — already allowed in next.config). */
export const pageBanners = {
  features: {
    src: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=1920&h=720&fit=crop&q=85",
    alt: "Warehouse inventory and stock shelves",
  },
  industries: {
    src: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&h=720&fit=crop&q=85",
    alt: "Logistics and distribution for trading businesses",
  },
  pricing: {
    src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&h=720&fit=crop&q=85",
    alt: "Business planning and ERP pricing discussion",
  },
  contact: {
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=720&fit=crop&q=85",
    alt: "Modern office — contact LoopC Business Strategies",
  },
  services: {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=720&fit=crop&q=85",
    alt: "Team collaborating on product strategy and software delivery",
  },
  work: {
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=720&fit=crop&q=85",
    alt: "Product analytics dashboard on laptop — shipped software in production",
  },
  about: {
    src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&h=720&fit=crop&q=85",
    alt: "Founders reviewing strategy — solutions-first software house",
  },
} as const;

export type PageBannerKey = keyof typeof pageBanners;
