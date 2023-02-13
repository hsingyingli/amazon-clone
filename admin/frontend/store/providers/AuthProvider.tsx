import React, { createContext } from "react";

interface AuthContextInterface {

}


const initState: AuthContextInterface = {


}

const AuthContext = createContext<AuthContextInterface>(initState)


interface Props {
  children: React.ReactNode
}


const AuthProvider: React.FC<Props> = ({ children }) => {
  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  )
}

export {
  AuthContext,
  AuthProvider
}

