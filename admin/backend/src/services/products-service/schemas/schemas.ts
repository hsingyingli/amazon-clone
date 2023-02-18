type Product = {
  id: number
  title: string
  description: string
  price: number
  amount: number
  imageUrl: string
  category_id: number
  created_at: Date
  updated_at: Date
}

type Category = {
  id: number
  title: string
  created_at: Date
  updated_at: Date
}


export {
  Product, Category
}
