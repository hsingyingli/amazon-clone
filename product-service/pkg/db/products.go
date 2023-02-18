package db

import "context"

const createProduct = `
  INSERT INTO products (
    title, price, amount, description, imageUrl, category_id 
  ) VALUES (
    $1, $2, $3, $4, $5, $6
  )
  RETURNING id, title, price, amount, description, imageUrl, category_id, created_at, updated_at, 
`

type CreateProductParam struct {
	Title       string
	Price       int64
	Amount      int64
	Description string
	ImageUrl    string
	Category_id int64
}

func (store *Store) CreateProduct(ctx context.Context, args CreateProductParam) (Product, error) {
	row := store.db.QueryRowContext(ctx, createProduct,
		args.Title,
		args.Price,
		args.Amount,
		args.Description,
		args.ImageUrl,
		args.Category_id)

	var product Product
	err := row.Scan(
		&product.ID,
		&product.Title,
		&product.Price,
		&product.Amount,
		&product.Description,
		&product.ImageUrl,
		&product.CategoryId,
		&product.CreatedAt,
		&product.UpdatedAt,
	)

	return product, err
}

const deleteProductById = `
  DELETE 
  FROM products 
  WHERE id = $1
`

func (store *Store) DeleteProductById(ctx context.Context, id int64) error {
	_, err := store.db.ExecContext(ctx, deleteProductById, id)
	return err
}
