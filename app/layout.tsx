import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Моя коллекция — монеты и банкноты",
  description: "Частный цифровой каталог памятных монет с фотографиями и предварительной оценкой.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
