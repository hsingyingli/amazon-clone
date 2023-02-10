import Head from "next/head"
import React from "react"
import Header from "../Headers"

interface Props {
  title: string
  children: React.ReactNode
}

const MainLayout: React.FC<Props> = ({ title, children }) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={`Amazon clone - ${title}`} />
        <meta name="author" content="Hsing Ying Li" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <title>{title}</title>
      </Head>
      <div>
        <Header />
        {children}
      </div>
    </>
  )
}

export {
  MainLayout
}
