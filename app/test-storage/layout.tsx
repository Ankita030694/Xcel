import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Storage Diagnostics | XCEL Stiro",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TestStorageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
