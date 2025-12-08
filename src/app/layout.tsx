import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/Provider";
import StoreProvider from "@/redux/StoreProvider";
import InitUser from "@/initUser";

export const metadata: Metadata = {
  title: "grocery app",
  description: "A grocery app built with Next.js and MongoDB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full min-h-screen-[200vh] bg-linear-to-b from-green-50 to-white">
        <Provider>
          <StoreProvider>
            <InitUser/>
            {children}
          </StoreProvider>
        </Provider>
      </body>
    </html>
  );
}
