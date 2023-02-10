import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, FormEvent, useCallback, useState } from "react";
import { AuthContext } from "@/store/providers/AuthProvider"
import Link from "next/link";

const LoginPage: NextPage = () => {
  const { login } = useContext(AuthContext)
  const [isSuccess, setIsSuccess] = useState(false)
  const [email, setEmail] = useState("")
  const [pwd, setPwd] = useState("")
  const router = useRouter()

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    const err = await login(email, pwd)

    if (err === null) {
      setEmail("")
      setPwd("")
      router.push("/")
    } else {
      setIsSuccess(false)
    }
  }

  return (
    <div className="max-w-sm w-full mx-auto flex flex-col items-center mt-3">
      <Link href={"/"}>
        <Image
          className="cursor-pointer w-20 md:w-24"
          src="/amazon-logo-black.png"
          alt="amazon-logo-white"
          width={80}
          height={24}
        /></Link>
      <p className={`${!isSuccess ? "block" : "hidden"} p-3 bg-red-200 rounded-sm text-red-600 mt-5`}>
        Email or Password is Wrong
      </p>
      <form
        className="border-gray-400 border-[1px] rounded-md my-5 w-full"
        onSubmit={handleLogin}
      >
        <div className="m-5 flex flex-col">
          <h1 className="font-semibold text-2xl my-5">Sign in</h1>
          <label className="text-sm font-semibold my-1">Email</label>
          <input
            className="text-sm outline outline-offset-1 outline-1 rounded-[2px] outline-gray-700 p-[2px]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="text-sm font-semibold my-1">Password</label>
          <input
            className="text-sm outline outline-offset-1 outline-1 rounded-[2px] outline-gray-700 p-[2px]"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          />
          <button
            type="submit"
            className="text-sm bg-yellow-300 hover:bg-yellow-400 transition-colors duration-150 mt-4 rounded py-[3px]"
          >
            Continue
          </button>
        </div>
      </form>
      <p className="text-gray-600 relative">New to Amazon?</p>
      <Link href="/signup"
        className="text-sm w-full text-center bg-gray-200 hover:bg-gray-300 border-gray-500 border-[1px] transition-colors duration-150 mt-4 rounded py-[3px]"
      >
        Create your Amazon account
      </Link>
    </div>
  )
}

export default LoginPage
