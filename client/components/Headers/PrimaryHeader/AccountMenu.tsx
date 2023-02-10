import { Menu, Transition } from '@headlessui/react'
import React, { Fragment, useContext } from 'react'
import { UserIcon } from '@heroicons/react/20/solid'
import { AuthContext } from "@/store/providers/AuthProvider"
import Link from 'next/link'
import { useRouter } from 'next/router'

const AccountMenu: React.FC = () => {
  const { user } = useContext(AuthContext)
  const router = useRouter()
  console.log("account menu", user)

  const redirectToLogin = () => {
    router.push("/login")
  }

  return (
    <Menu as='div' className="relative">
      <div className="flex items-center">
        <Menu.Button
          className="p-1 inline-flex rounded transition-colors duration-100 hover:bg-amazon-header-bg">
          <UserIcon className="w-8 h-8 p-1 text-white" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className="absolute right-0 mt-2 w-64 origin-top-right divide-y divide-gray-300 rounded bg-white">
          {
            user === null
              ?
              <Menu.Item>
                <div className='p-3'>
                  <button
                    className='bg-yellow-500 hover:bg-yellow-400 transition-colors duration-150 text-black text-sm w-full rounded py-1'
                    onClick={redirectToLogin}
                  >
                    Login
                  </button>
                  <p className='text-sm text-center mt-1'>New customer? <Link href="/signup" className='text-blue-500 underline hover:text-yellow-600'>Start here.</Link></p>
                </div>
              </Menu.Item>
              :
              <Menu.Item>
                {({ active }) => (
                  <div>World</div>
                )}
              </Menu.Item>
          }



        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default AccountMenu
