import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "系统图谱",
  description: "面向高可靠 Web 系统构建的系统化知识图谱。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
