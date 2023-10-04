"use client";

import { Menu, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary">
      <div className="flex items-center">
        <Menu className="block md:hidden " />
        <Link href="/">
            <Image height={120} width={120} alt="Logo" src="/starchatGold.svg" className="md:block hidden" />
        </Link>
      </div>
      <div className="flex items-center gap-x-3">
        <Button size='sm' variant='premium'>Free Upgrade<Sparkles className="h-4 w-4 fill-white text-white ml-2"/></Button>
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;


