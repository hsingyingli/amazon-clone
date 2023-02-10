import React from "react"
import PrimaryHeader from "./PrimaryHeader"
import SecondaryHeader from "./SecondaryHeader"

const Header: React.FC = () => {
  return (
    <header className="w-screen">
      <PrimaryHeader />
      <SecondaryHeader />
    </header>
  )
}

export default Header
