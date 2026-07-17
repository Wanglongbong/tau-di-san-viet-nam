import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3001";
  const protocol = host.includes("localhost") ? "http" : "https";
  const metadataBase = new URL(`${protocol}://${host}`);
  return {
    metadataBase,
    title: "Tàu Di Sản Việt Nam",
    description: "Hành trình pixel Bắc–Nam qua năm di sản sống, với câu chuyện song ngữ và nguồn được kiểm chứng.",
    openGraph: {
      title: "Tàu Di Sản Việt Nam",
      description: "Chạm vào ký ức đang sống trên chuyến tàu di sản Bắc–Nam.",
      images: [{ url: "/og.png", width: 1734, height: 907, alt: "Khoang Tàu Di Sản Việt Nam trong phong cách pixel" }],
      type: "website",
    },
    twitter: { card: "summary_large_image", title: "Tàu Di Sản Việt Nam", images: ["/og.png"] },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
