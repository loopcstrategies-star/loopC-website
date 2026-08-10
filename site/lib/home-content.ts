/** Content-rich homepage copy — short paragraphs + cards, not walls of text. */

export const heroPills = [
  { label: "Web Apps", icon: "web" },
  { label: "Mobile Apps", icon: "mobile" },
  { label: "ERP Systems", icon: "erp" },
  { label: "Custom Software", icon: "custom" },
] as const;

export const companyStats = [
  { value: "3+", label: "Years Experience" },
  { value: "20+", label: "Projects Delivered" },
  { value: "5+", label: "Industries Served" },
  { value: "∞", label: "Happy Clients Growing" },
] as const;

export const whatWeDoCards = [
  {
    id: "web",
    title: "Web Applications",
    summary:
      "Build powerful web applications that simplify operations, connect teams and give your customers better digital experiences.",
    items: [
      "Business Platforms",
      "Admin Dashboards",
      "Customer Portals",
      "SaaS Applications",
      "Management Systems",
      "Internal Tools",
      "E-commerce Platforms",
    ],
    href: "/services#web",
    cta: "Explore Web Development",
  },
  {
    id: "mobile",
    title: "Mobile Applications",
    summary:
      "Give your customers and employees the ability to work, communicate and access business services from anywhere.",
    items: [
      "Business Mobile Apps",
      "Customer Applications",
      "Employee Applications",
      "Field Operations Apps",
      "Booking Applications",
      "Service Applications",
    ],
    href: "/services#mobile",
    cta: "Explore Mobile Development",
  },
  {
    id: "erp",
    title: "ERP Solutions",
    summary:
      "Connect your business operations through one centralized platform designed to give teams and management better control.",
    items: [
      "Accounting",
      "Inventory",
      "Sales",
      "Purchasing",
      "Customers",
      "Vendors",
      "HR",
      "Attendance",
      "Operations",
      "Reports",
    ],
    href: "/erp",
    cta: "Explore LoopC ERP",
  },
  {
    id: "custom",
    title: "Custom Software",
    summary:
      "Have a business process that doesn't fit existing software? We design and develop a solution specifically for the way your organization works.",
    items: [
      "Custom Workflows",
      "Business Automation",
      "API Integrations",
      "Management Systems",
      "Data Platforms",
      "Internal Applications",
      "AI-powered Solutions",
    ],
    href: "/contact",
    cta: "Discuss Your Requirement",
  },
] as const;

export const possibilities = [
  {
    title: "Business Management",
    description: "Centralize daily operations, employees, customers, tasks and reporting.",
  },
  {
    title: "Customer Platforms",
    description: "Ordering, booking, communication and service in one digital experience.",
  },
  {
    title: "Internal Systems",
    description: "Replace spreadsheets and disconnected processes with centralized apps.",
  },
  {
    title: "Automation",
    description: "Connect workflows, notifications, approvals and business processes.",
  },
  {
    title: "Dashboards",
    description: "Turn business data into clear dashboards and actionable information.",
  },
  {
    title: "AI-Powered Applications",
    description: "Intelligent search, recommendations, insights and AI assistants.",
  },
] as const;

export const erpFeatureGrid = [
  { title: "Dashboard", description: "See your business at a glance." },
  { title: "Accounting", description: "Manage financial operations." },
  { title: "Inventory", description: "Track stock and movement." },
  { title: "Customers", description: "Manage customer relationships." },
  { title: "Purchasing", description: "Control suppliers and purchases." },
  { title: "Reports", description: "Understand your business data." },
  { title: "Employees", description: "Manage people and attendance." },
  { title: "Notifications", description: "Keep your team informed." },
] as const;

export const erpIndustries = [
  {
    title: "Jewelry & Precious Metals",
    description:
      "Metal inventory, purchases, sales, customers, suppliers and financial workflows in one system.",
  },
  {
    title: "Manufacturing",
    description: "Production, inventory, purchasing and operational systems.",
  },
  {
    title: "Trading & Distribution",
    description: "Customers, suppliers, transactions, inventory and financial workflows.",
  },
  {
    title: "Retail",
    description: "Sales, inventory, customers and business analytics.",
  },
  {
    title: "Education",
    description: "Students, teachers, attendance, fees and center management.",
  },
  {
    title: "Professional Services",
    description: "Clients, projects, employees, billing and operations.",
  },
  {
    title: "Wholesale",
    description: "High SKU counts, stock, sales and accounts in one place.",
  },
  {
    title: "Service Businesses",
    description: "Bookings, field teams, customers and reporting.",
  },
] as const;

export const customVsErp = {
  erp: [
    "Ready business modules",
    "Faster implementation",
    "Standard workflows",
    "Predictable pricing",
    "Regular updates",
  ],
  custom: [
    "Unique business processes",
    "Specialized workflows",
    "Custom customer experience",
    "Complex integrations",
    "Completely tailored functionality",
  ],
} as const;

export const detailedProcess = [
  {
    num: "01",
    title: "Discover",
    summary: "We understand your business, users, goals and challenges.",
    items: ["Business Requirements", "User Requirements", "Features", "Workflows", "Project Scope"],
  },
  {
    num: "02",
    title: "Plan",
    summary: "Transform requirements into a clear technical and product roadmap.",
    items: ["Architecture", "User Flow", "Technology", "Database", "API Structure"],
  },
  {
    num: "03",
    title: "Design",
    summary: "Create the interface and experience before development begins.",
    items: ["Wireframes", "UI Design", "Responsive Design", "User Experience", "Design System"],
  },
  {
    num: "04",
    title: "Develop",
    summary: "Turn the approved design into a working application.",
    items: ["Frontend", "Backend", "Database", "APIs", "Integrations"],
  },
  {
    num: "05",
    title: "Test",
    summary: "We test thoroughly for quality, security, performance and bugs.",
    items: ["Functional", "UI", "API", "Performance", "Bug Fixing"],
  },
  {
    num: "06",
    title: "Deploy",
    summary: "We deploy your application and make it production ready.",
    items: ["Cloud Deployment", "Database Setup", "Security", "Monitoring"],
  },
  {
    num: "07",
    title: "Support",
    summary: "We provide continuous support and future enhancements.",
    items: ["Maintenance", "Bug Fixes", "Updates", "New Features", "Support"],
  },
] as const;

export const qualityPillars = [
  { title: "Functional", description: "Does everything work as expected?" },
  { title: "Performance", description: "Does it remain responsive under real usage?" },
  { title: "Security", description: "Are users and business data protected?" },
  { title: "Responsive", description: "Does it work across devices and screen sizes?" },
  { title: "Usability", description: "Can users understand and complete tasks easily?" },
  { title: "Reliability", description: "Does the system remain stable in production?" },
] as const;

export const whyDetailed = [
  {
    title: "Business First",
    description: "We start with your business requirements and goals before choosing the technology.",
  },
  {
    title: "One Team",
    description: "Design, development, testing and deployment through one coordinated team.",
  },
  {
    title: "Built Around You",
    description: "Solutions around your workflows — not rigid software you must adapt to.",
  },
  {
    title: "Quality Focused",
    description: "Structured testing before every application reaches production.",
  },
  {
    title: "Scalable Architecture",
    description: "Systems that can evolve as your business grows.",
  },
  {
    title: "Long-Term Support",
    description: "Improvements, maintenance and new requirements after launch.",
  },
] as const;

export const faqs = [
  {
    q: "What type of applications does LoopC build?",
    a: "We build custom web applications, mobile applications, ERP systems, dashboards, internal business platforms and other software solutions based on your requirements.",
  },
  {
    q: "Can you build an application from our existing idea?",
    a: "Yes. We can take an existing concept, business process, document or requirement and transform it into a structured software product.",
  },
  {
    q: "Do you provide testing?",
    a: "Yes. Application testing is part of our development process — functionality, interfaces, APIs, responsiveness, performance and real-world workflows before deployment.",
  },
  {
    q: "Can you integrate with our existing software?",
    a: "Yes. Depending on the system, we can integrate APIs, databases, payment systems, third-party platforms and other business tools.",
  },
  {
    q: "Do you provide support after deployment?",
    a: "Yes. We provide ongoing maintenance, bug fixes, improvements and new feature development based on your requirements.",
  },
  {
    q: "Can we customize LoopC ERP?",
    a: "Yes. Depending on your plan and requirements, we can configure or extend ERP functionality to better match your business processes.",
  },
] as const;

export const journeySteps = [
  "Idea",
  "Requirements",
  "Design",
  "Development",
  "Testing",
  "Deployment",
  "Support",
] as const;

export const businessFlow = [
  "Customers",
  "Sales",
  "Operations",
  "Inventory",
  "Finance",
  "Management",
] as const;
