"use client";
import "./globals.css";
import { Press_Start_2P, VT323 } from "next/font/google";
import type React from "react";
import FloatingPixels from "./components/FloatingPixels";
import SoundEffect from "./components/SoundEffect";
import PixelatedBackground from "./components/PixelatedBackground";
import Provider from "@/components/Provider";
import { CustomConnectButton } from "./components/ConnectButton";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start-2p",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${pressStart2P.variable} ${vt323.variable} font-sans bg-gray-900 text-green-400 dark:bg-gray-900 dark:text-green-400`}
      >
        <Provider>
          <header className="p-8 flex flex-col">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">OmniBets</h1>
              <CustomConnectButton />
            </div>
          </header>
          <PixelatedBackground />
          <div className=" mx-auto px-4">
            <main>{children}</main>
            <footer className="py-8 text-center font-mono">
              © 2025 OmniBets. All rights pixelated.
            </footer>
          </div>
          <FloatingPixels />
          <SoundEffect />
        </Provider>
      </body>
    </html>
  );
}
