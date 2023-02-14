import { useAuth } from "@/hooks/useAuth";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast"

const LoginPage: NextPage = () => {
  const emailRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [pwd, setPwd] = useState("")
  const { loginUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const toastId = toast.loading('Loading...');
    const error = await loginUser(email, pwd)

    if (error === null) {
      toast.success('Success', {
        id: toastId,
      })
      router.push("/")
    } else {
      console.log(error)
      toast.error('Fail to Login', {
        id: toastId,
      });
    }

  }

  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center p-3">
      <div className="max-w-sm w-full">
        <Link href="/">
          <Image
            className="rounded-md mx-auto mb-6"
            src={"/assets/logo.jpg"} width={144} height={144} alt="logo" />
        </Link>

        <form
          className="flex gap-5 flex-col "
          onSubmit={handleOnSubmit}>
          <input
            className="outline-none border-2 border-gray-400 focus:border-gray-900 transition-colors duration-200  rounded-md px-2 py-1"
            ref={emailRef}
            type="email"
            value={email}
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="outline-none border-2 border-gray-400 focus:border-gray-900 transition-colors duration-200  rounded-md px-2 py-1"
            value={pwd}
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPwd(e.target.value)}
          />
          <button
            disabled={isLoading}
            className="border-2 border-gray-400 rounded-md px-2 py-1"
            type="submit">Login</button>
        </form>
        <hr className="border-[1px] my-8" />
        <p className="text-center text-gray-500">New to guzih goods? Contact to admins to create account!</p>
      </div>
    </div>
  )
}

export default LoginPage
