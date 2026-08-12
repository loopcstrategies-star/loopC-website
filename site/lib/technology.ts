export type TechGroup = {
  id: string;
  title: string;
  items: string[];
};

export const technology: TechGroup[] = [
  {
    id: "frontend",
    title: "Frontend",
    items: ["React", "Next.js", "TypeScript", "HTML", "CSS", "Tailwind"],
  },
  {
    id: "mobile",
    title: "Mobile",
    items: ["Flutter", "React Native", "Native technologies where appropriate"],
  },
  {
    id: "backend",
    title: "Backend",
    items: ["Node.js", "APIs", "Databases", "Authentication"],
  },
  {
    id: "infrastructure",
    title: "Infrastructure",
    items: ["Cloud", "Deployment", "Monitoring", "Security"],
  },
];
