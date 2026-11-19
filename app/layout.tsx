import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:"Моя коллекция — монеты СССР",description:"Частный цифровой каталог памятных монет СССР с фотографиями и предварительной оценкой."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru"><body>{children}</body></html>}
