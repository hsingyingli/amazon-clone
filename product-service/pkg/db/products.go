package db

import "context"

const createProduct = `
  INSERT INTO products (
    uid, title, price, description, imageUrl, category_id 
  ) VALUES (
    $1, $2, $3, $4, $5, $6
  )
  RETURNING id, uid, title, description, price, imageUrl, category_id, created_at, updated_at, 
`

type CreateProductParam struct {
	UID         int64
	Title       string
	Price       int64
	Description string
	ImageUrl    string
	Category_id int64
}

func (store *Store) CreateProduct(ctx context.Context, args CreateProductParam) (Product, error) {
	row := store.db.QueryRowContext(ctx, createProduct,
		args.UID,
		args.Title,
		args.Price,
		args.Description,
		args.ImageUrl,
		args.Category_id)

	var product Product
	err := row.Scan(
		&product.ID,
		&product.UID,
		&product.Title,
		&product.Description,
		&product.Price,
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

const deleteProductByUId = `
  DELETE 
  FROM products 
  WHERE uid = $1
`

func (store *Store) DeleteProductByUId(ctx context.Context, uid int64) error {
	_, err := store.db.ExecContext(ctx, deleteProductById, uid)
	return err
}
