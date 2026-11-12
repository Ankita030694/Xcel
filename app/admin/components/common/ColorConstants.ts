export interface ColorOption {
  name: string;
  color: string;
}

export interface ColorGroup {
  group: string;
  colors: ColorOption[];
}

export const QUICK_COLORS: ColorOption[] = [
  { name: "Default Charcoal", color: "#1f2937" },
  { name: "Brand Navy", color: "#0a2766" },
  { name: "Primary Blue", color: "#32589c" },
  { name: "Vibrant Blue", color: "#2563eb" },
  { name: "Emerald Green", color: "#059669" },
  { name: "Amber Orange", color: "#d97706" },
  { name: "Crimson Red", color: "#dc2626" },
  { name: "Purple", color: "#7c3aed" },
];

export const COLOR_GROUPS: ColorGroup[] = [
  {
    group: "Brand & Blues",
    colors: [
      { name: "Brand Navy", color: "#0a2766" },
      { name: "Deep Navy", color: "#1e3a8a" },
      { name: "Classic Navy", color: "#1d4ed8" },
      { name: "Steel Blue", color: "#32589c" },
      { name: "Vibrant Blue", color: "#2563eb" },
      { name: "Sky Blue", color: "#0284c7" },
      { name: "Ocean Cyan", color: "#0891b2" },
      { name: "Bright Cyan", color: "#06b6d4" },
    ],
  },
  {
    group: "Greens & Teals",
    colors: [
      { name: "Dark Forest", color: "#14532d" },
      { name: "Hunter Green", color: "#15803d" },
      { name: "Emerald Green", color: "#059669" },
      { name: "Jade Mint", color: "#10b981" },
      { name: "Deep Teal", color: "#115e59" },
      { name: "Teal", color: "#0d9488" },
      { name: "Olive Green", color: "#4d7c0f" },
      { name: "Lime Green", color: "#65a30d" },
    ],
  },
  {
    group: "Warm & Oranges",
    colors: [
      { name: "Bronze Gold", color: "#b45309" },
      { name: "Amber Orange", color: "#d97706" },
      { name: "Warm Tangerine", color: "#ea580c" },
      { name: "Bright Orange", color: "#f97316" },
      { name: "Goldenrod", color: "#ca8a04" },
      { name: "Warm Yellow", color: "#eab308" },
    ],
  },
  {
    group: "Reds & Pinks",
    colors: [
      { name: "Dark Burgundy", color: "#881337" },
      { name: "Wine Red", color: "#991b1b" },
      { name: "Deep Crimson", color: "#b91c1c" },
      { name: "Crimson Red", color: "#dc2626" },
      { name: "Coral Red", color: "#ef4444" },
      { name: "Rose Pink", color: "#e11d48" },
      { name: "Hot Pink", color: "#ec4899" },
      { name: "Magenta", color: "#db2777" },
    ],
  },
  {
    group: "Purples & Indigos",
    colors: [
      { name: "Midnight Indigo", color: "#312e81" },
      { name: "Deep Indigo", color: "#3730a3" },
      { name: "Royal Indigo", color: "#4338ca" },
      { name: "Indigo", color: "#4f46e5" },
      { name: "Violet", color: "#7c3aed" },
      { name: "Royal Purple", color: "#9333ea" },
      { name: "Lilac Purple", color: "#a855f7" },
      { name: "Deep Plum", color: "#701a75" },
    ],
  },
  {
    group: "Neutrals & Grayscale",
    colors: [
      { name: "Solid Black", color: "#000000" },
      { name: "Charcoal (Default)", color: "#1f2937" },
      { name: "Dark Slate", color: "#374151" },
      { name: "Cool Gray", color: "#4b5563" },
      { name: "Steel Muted", color: "#6b7280" },
      { name: "Medium Gray", color: "#9ca3af" },
      { name: "Silver", color: "#cbd5e1" },
      { name: "Warm Taupe", color: "#78716c" },
    ],
  },
];

