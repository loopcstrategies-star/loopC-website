import "dotenv/config";
import { PrismaClient, CouponType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const MODULES = {
  accounting: "Accounting",
  invoicing: "Invoicing",
  inventory: "Inventory",
  crm: "CRM",
  reports_basic: "Basic reports",
  reports: "Reports",
  reports_advanced: "Advanced reports",
  hr: "HR",
  payroll: "Payroll",
  api: "API access",
} as const;

async function upsertPlan(input: {
  slug: string;
  name: string;
  description: string;
  monthlyPriceInr: number | null;
  yearlyPriceInr: number | null;
  isCustomPricing?: boolean;
  sortOrder: number;
  supportLevel: string;
  features: string[];
  limits: Record<string, number>;
}) {
  const plan = await prisma.plan.upsert({
    where: { slug: input.slug },
    create: {
      slug: input.slug,
      name: input.name,
      description: input.description,
      monthlyPriceInr: input.monthlyPriceInr,
      yearlyPriceInr: input.yearlyPriceInr,
      isCustomPricing: input.isCustomPricing ?? false,
      sortOrder: input.sortOrder,
      supportLevel: input.supportLevel,
      isActive: true,
      trialEligible: !input.isCustomPricing,
    },
    update: {
      name: input.name,
      description: input.description,
      monthlyPriceInr: input.monthlyPriceInr,
      yearlyPriceInr: input.yearlyPriceInr,
      isCustomPricing: input.isCustomPricing ?? false,
      sortOrder: input.sortOrder,
      supportLevel: input.supportLevel,
      isActive: true,
    },
  });

  await prisma.planFeature.deleteMany({ where: { planId: plan.id } });
  await prisma.planLimit.deleteMany({ where: { planId: plan.id } });

  await prisma.planFeature.createMany({
    data: input.features.map((moduleKey) => ({
      planId: plan.id,
      moduleKey,
      enabled: true,
      label: MODULES[moduleKey as keyof typeof MODULES] ?? moduleKey,
    })),
  });

  await prisma.planLimit.createMany({
    data: Object.entries(input.limits).map(([limitKey, value]) => ({
      planId: plan.id,
      limitKey,
      value,
    })),
  });

  return plan;
}

async function main() {
  await prisma.billingSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      trialEnabled: true,
      trialDays: 14,
      trialRequiresPayment: false,
      gracePeriodDays: 7,
      retentionDays: 90,
      taxPercent: 18,
    },
    update: {},
  });

  const permissions = [
    { key: "billing.manage", name: "Manage billing" },
    { key: "team.view", name: "View team" },
    { key: "team.manage", name: "Manage team" },
    { key: "settings.manage", name: "Manage settings" },
    { key: "modules.use", name: "Use ERP modules" },
    { key: "reports.view", name: "View reports" },
    { key: "customers.view", name: "View customers" },
    { key: "customers.manage", name: "Manage customers" },
    { key: "products.view", name: "View products" },
    { key: "products.manage", name: "Manage products" },
    { key: "invoices.view", name: "View sales invoices" },
    { key: "invoices.manage", name: "Manage sales invoices" },
    { key: "inventory.view", name: "View inventory" },
    { key: "inventory.manage", name: "Manage inventory" },
    { key: "crm.view", name: "View CRM" },
    { key: "crm.manage", name: "Manage CRM" },
  ];

  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { key: p.key },
      create: p,
      update: { name: p.name },
    });
  }

  const allPerms = await prisma.permission.findMany();

  async function ensureSystemRole(key: string, name: string, permKeys: string[]) {
    let role = await prisma.role.findFirst({ where: { companyId: null, key } });
    if (!role) {
      role = await prisma.role.create({
        data: { companyId: null, key, name, isSystem: true },
      });
    }
    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
    const selected = allPerms.filter((p) => permKeys.includes(p.key));
    await prisma.rolePermission.createMany({
      data: selected.map((p) => ({ roleId: role!.id, permissionId: p.id })),
    });
    return role;
  }

  const allKeys = permissions.map((p) => p.key);
  await ensureSystemRole("company_admin", "Company Admin", allKeys);
  await ensureSystemRole("manager", "Manager", [
    "modules.use",
    "reports.view",
    "team.view",
    "team.manage",
    "customers.view",
    "customers.manage",
    "products.view",
    "products.manage",
    "invoices.view",
    "invoices.manage",
    "inventory.view",
    "inventory.manage",
    "crm.view",
    "crm.manage",
  ]);
  await ensureSystemRole("employee", "Employee", [
    "modules.use",
    "team.view",
    "customers.view",
    "products.view",
    "invoices.view",
  ]);
  await ensureSystemRole("accountant", "Accountant", [
    "modules.use",
    "reports.view",
    "team.view",
    "customers.view",
    "customers.manage",
    "products.view",
    "invoices.view",
    "invoices.manage",
  ]);

  await upsertPlan({
    slug: "starter",
    name: "Starter",
    description: "For small teams getting started with core finance.",
    monthlyPriceInr: 199900,
    yearlyPriceInr: 1999900,
    sortOrder: 1,
    supportLevel: "email",
    features: ["accounting", "invoicing", "reports_basic"],
    limits: { users: 5, storage_gb: 5, branches: 1, invoices_per_month: 100 },
  });

  await upsertPlan({
    slug: "business",
    name: "Business",
    description: "Grow with inventory, CRM and stronger reporting.",
    monthlyPriceInr: 499900,
    yearlyPriceInr: 4999900,
    sortOrder: 2,
    supportLevel: "priority_email",
    features: ["accounting", "invoicing", "inventory", "crm", "reports"],
    limits: { users: 20, storage_gb: 50, branches: 3, invoices_per_month: 1000 },
  });

  await upsertPlan({
    slug: "professional",
    name: "Professional",
    description: "Full operations stack with HR, payroll and API access.",
    monthlyPriceInr: 999900,
    yearlyPriceInr: 9999900,
    sortOrder: 3,
    supportLevel: "phone_email",
    features: [
      "accounting",
      "invoicing",
      "inventory",
      "crm",
      "reports",
      "reports_advanced",
      "hr",
      "payroll",
      "api",
    ],
    limits: { users: 50, storage_gb: 200, branches: 10, invoices_per_month: 5000 },
  });

  await upsertPlan({
    slug: "enterprise",
    name: "Enterprise",
    description: "Custom limits, modules and priority support.",
    monthlyPriceInr: null,
    yearlyPriceInr: null,
    isCustomPricing: true,
    sortOrder: 4,
    supportLevel: "priority",
    features: [
      "accounting",
      "invoicing",
      "inventory",
      "crm",
      "reports",
      "reports_advanced",
      "hr",
      "payroll",
      "api",
    ],
    limits: { users: 9999, storage_gb: 9999, branches: 9999, invoices_per_month: 999999 },
  });

  await prisma.coupon.upsert({
    where: { code: "LAUNCH20" },
    create: {
      code: "LAUNCH20",
      type: CouponType.PERCENT,
      value: 20,
      maxRedemptions: 1000,
      isActive: true,
    },
    update: { isActive: true, value: 20 },
  });

  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@loopcstrategies.com";
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!password) {
    throw new Error("SEED_ADMIN_PASSWORD must be set in the environment to seed the admin user.");
  }
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name: "LoopC Super Admin",
      passwordHash,
      isSuperAdmin: true,
      country: "IN",
    },
    update: {
      passwordHash,
      isSuperAdmin: true,
    },
  });

  console.log("Seed complete.");
  console.log(`Super admin: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
