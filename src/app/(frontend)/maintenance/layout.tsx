import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Przerwa techniczna",
  robots: { index: false, follow: false },
};

export default function MaintenanceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
