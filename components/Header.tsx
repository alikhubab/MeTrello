import React from "react";
import Image from "next/image";
import logo from "@/public/logotext.png";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";

function Header() {
  return (
    <header>
      <Image
        className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
        src={logo}
        alt="MeTrello Logo"
        width={100}
        height={100}
      />
      <div>
        <form>
          <MagnifyingGlassIcon className="w-6 h-6 text-gray-400" />
          <input type="text" placeholder="Search" />
          <button hidden>Search</button>
        </form>
        {/* Avatar */}
      </div>
    </header>
  );
}

export default Header;
