import React from "react";
import { FizziLogo } from "./FizziLogo";
import CircleText from "./CircleText";

type Props = object;

export default function Footer({}: Props) {
  return (
    <footer className="bg-[#FEE832] text-[#FE6334]">
      <div className="relative mx-auto flex w-full max-w-4xl justify-center px-4 py-10">
        <FizziLogo />
        <div className="absolute right-24 top-0 size-28 origin-center -translate-y-14 md:size-48 md:-translate-y-28">
          <CircleText />
        </div>
      </div>
      <div className="border-t border-[#FE6334]/20 py-6 text-center">
        <p className="text-sm md:text-base">
          © {new Date().getFullYear()} All Rights Reserved | Design By{" "}
          <a
            href="https://webappssoft.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold hover:underline"
          >
            WASS
          </a>
        </p>
      </div>
    </footer>
  );
}