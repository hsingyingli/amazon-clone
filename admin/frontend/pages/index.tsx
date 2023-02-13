import { useAuth } from "@/hooks/useAuth";
import { NextPage } from "next";

const HomePage: NextPage = () => {
  const { user } = useAuth()
  return (
    <div>{user ? user.username : "not auth yet"}</div>
  )
}

export default HomePage
