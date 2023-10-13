"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import MobileSidebar from "./mobile-sidebar";

const Navbar = () => {
  return (
    <div className="h-16 fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary">
      <div className="flex justify-between items-center m-auto w-full xl:w-[1200px]">
        <div className="flex items-center">
          <MobileSidebar /> 
          <Link href="/">
            <Image
              height={120} 
              width={120}
              alt="Logo"
              src="/new_starchat.svg"
              className="md:block hidden"
            />
          </Link>
        </div>
        <div className="flex items-center gap-x-3">
          <Button size="sm" variant="premium">
            Free Upgrade
            <Sparkles className="h-4 w-4 fill-white text-white ml-2" />
          </Button>
          <ModeToggle />
          <UserButton />
        </div>
    </div>
    </div>
  );
};

export default Navbar;
