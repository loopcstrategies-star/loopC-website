import { AdminSettingsClient } from "@/components/admin/settings-client";
import { requireAdminSession } from "@/lib/session-guards";
import { prisma } from "@/server/db";

export default async function AdminSettingsPage() {
  await requireAdminSession();
  const settings =
    (await prisma.billingSettings.findUnique({ where: { id: "default" } })) ??
    (await prisma.billingSettings.create({ data: { id: "default" } }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <AdminSettingsClient
        settings={{
          trialEnabled: settings.trialEnabled,
          trialDays: settings.trialDays,
          trialRequiresPayment: settings.trialRequiresPayment,
          gracePeriodDays: settings.gracePeriodDays,
          downgradeMode: settings.downgradeMode,
          retentionDays: settings.retentionDays,
          taxPercent: settings.taxPercent,
          currency: settings.currency,
        }}
      />
    </div>
  );
}
