import "./globals.css";
import { Noto_Sans_JP } from "next/font/google";
import { Toaster } from "react-hot-toast";
import RecoilProvider from "./recoilProvider"

const inter = Noto_Sans_JP({ subsets: ["latin"] });

export const metadata = {
  title: "オンライン会議システム",
  description: "カードゲームのmetopher",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={inter.className}>
        <RecoilProvider>
        <main className="min-h-screen p-10">{children}</main>
        <Toaster />
        </RecoilProvider>
      </body>
    </html>
  );
}
