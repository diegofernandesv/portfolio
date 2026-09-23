import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import { IntroProvider } from "@/components/IntroProvider";
import Loader from "@/components/Loader/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Diego — Digital Product Designer & Creative Developer",
  description:
    "Digital designer focused on UX/UI, AI and creative development, based in Aarhus, Denmark.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={instrumentSans.variable}>
      <body>
        <noscript>
          <style>{`[data-reveal]{visibility:visible!important}[data-reveal-media]{clip-path:none!important}`}</style>
        </noscript>
        <IntroProvider>
          <SmoothScroll>
            <Loader />
            {children}
          </SmoothScroll>
        </IntroProvider>
      </body>
    </html>
  );
}
