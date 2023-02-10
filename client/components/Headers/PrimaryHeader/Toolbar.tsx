import AccountMenu from "./AccountMenu"
import ShoppingCart from "./ShoppingCart"

const Toolbar = () => {

  return (
    <div className="flex items-center gap-2 ml-auto">
      <AccountMenu />
      <ShoppingCart />
    </div>
  )
}

export default Toolbar
