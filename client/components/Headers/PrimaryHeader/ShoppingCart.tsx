import React from "react"
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { ShoppingCartIcon } from '@heroicons/react/20/solid'

const ShoppingCart: React.FC = () => {
  return (
    <Menu as='div' className="relative">
      <div className="flex items-center">
        <Menu.Button
          className="p-1 inline-flex rounded transition-colors duration-100 hover:bg-amazon-header-bg">
          <ShoppingCartIcon className="w-8 h-8 p-1 text-white" />
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
          className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded bg-amazon-header-bg">
          <Menu.Item>
            {({ active }) => (
              <div>Hello</div>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <div>World</div>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default ShoppingCart
