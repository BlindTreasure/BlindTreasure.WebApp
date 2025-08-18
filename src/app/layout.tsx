import type { Metadata } from "next";
import { Inter, Poppins, Roboto} from "next/font/google";
import "./globals.css";
import Provider from "@/provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  weight: ["400", "600"],
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});


export const metadata: Metadata = {
  title: "Trang chủ",
  description: "This is BlindTreasure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${poppins.className} ${roboto.variable}`}>
        <Toaster
          position="top-left"
          richColors
          expand={false}
          style={{ marginRight: 28 }}
        />
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
