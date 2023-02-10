import Image from "next/image"
import Toolbar from "./Toolbar"

const PrimaryHeader = () => {
  return (
    <div className="bg-amazon-header-bg-dark px-6 py-4 flex gap-5 items-center">
      <Image
        className="cursor-pointer w-20 md:w-24"
        src="/amazon-logo-white.png"
        alt="amazon-logo-white"
        width={80}
        height={24}
      />

      <div className="rounded overflow-hidden">
        <input className="focus:outline-none px-2 block" />
      </div>

      <Toolbar />
    </div>
  )
}

export default PrimaryHeader
