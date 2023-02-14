import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CubeIcon, HomeIcon } from "@heroicons/react/24/outline"

const LeftNavbar: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center">
      <Link href={"/"}>
        <Image
          className="my-5"
          src={"/assets/logo.jpg"} width={144} height={144} alt="logo" />
      </Link>
      <nav className="w-full p-5">
        <Link href="/" className="transition-colors duration-200 text-lg flex items-center gap-5 my-4 p-2 rounded-md hover:bg-gray-100">
          <HomeIcon className="w-8 h-8" />
          Overview
        </Link>
        <Link href="/product" className="transition-colors duration-200 text-lg flex items-center gap-5 my-4 p-2 rounded-md hover:bg-gray-100">
          <CubeIcon className="w-8 h-8" />
          Product
        </Link>
      </nav>
    </div>
  )
}

export {
  LeftNavbar
}
