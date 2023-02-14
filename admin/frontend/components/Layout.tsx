import React from "react";
import { LeftNavbar } from "./LeftNavbar";


interface Props {
  children: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="w-screen min-h-screen flex">
      <div className="w-[240px] border-r-[1px] border-gray-300">
        <LeftNavbar />
      </div>
      <div className="flex-grow">
        {children}
      </div>
    </div>
  )
}

export {
  Layout
}
