const createProduct = `
  INSERT INTO products (
    title, price, amount, description, imageUrl, category_id 
  ) VALUES (
    $1, $2, $3, $4, $5, $6
  )
  RETURNING id, title, description, price, amount, imageUrl, category_id, created_at, updated_at 
`
const updateProduct = `
  UPDATE products
  SET title = $2,
      price = $3,
      amount = $4,
      description = $5,
      imageUrl = $6,
      category_id = $7,
      updated_at = $8
  WHERE id = $1
  RETURNING *;
`

const updateProductAmount = `
  UPDATE products
  SET amount = $2,
      updated_at = $3
  WHERE id = $1
  RETURNING *;
`

const listAllProduct = `
  SELECT *
  FROM products
  LIMIT $1
  OFFSET $2;
`

const listProductByCategory = `
  SELECT *
  FROM products
  WHERE category_id = $1
  LIMIT $2
  OFFSET $3;
`

const deleteProductById = `
  DELETE 
  FROM products 
  WHERE id = $1
`
const createCategory = `
  INSERT INTO categories (
    title
  ) VALUES (
    $1
  ) RETURNING *;
`

const listCategory = `
  SELECT * 
  FROM categories
`

const updateCategory = `
  UPDATE categories
  SET title = $2,
      updated_at = $3
  WHERE id = $1
  RETURNING *;
`

const deleteCategoryById = `
  DELETE 
  FROM categories
  WHERE id = $1
  RETURNING *;
`


export {
  createProduct, deleteProductById, updateProduct,
  updateProductAmount, listAllProduct, listProductByCategory,
  createCategory, listCategory, updateCategory, deleteCategoryById,
}
