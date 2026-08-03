import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | MediBlack",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-slate-100 text-navy antialiased">
      {children}
    </div>
  );
}
