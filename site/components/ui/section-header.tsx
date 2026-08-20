import { SectionLabel, SectionLabelLight } from "@/components/ui/container";

export function SectionHeader({
  eyebrow,
  title,
  description,
  light = false,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  light?: boolean;
  align?: "left" | "center";
  className?: string;
}) {
  const Label = light ? SectionLabelLight : SectionLabel;
  const alignClass = align === "center" ? "mx-auto text-center" : "";

  return (
    <div className={`max-w-3xl ${alignClass} ${className}`}>
      {eyebrow ? <Label>{eyebrow}</Label> : null}
      <h2 className={`type-h2 mt-3 font-bold ${light ? "text-white" : "text-slate-950"}`}>
        {title}
      </h2>
      {description ? (
        <p className={`mt-4 max-w-2xl text-base leading-relaxed ${light ? "text-slate-300" : "text-slate-600"} ${align === "center" ? "mx-auto" : ""}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
