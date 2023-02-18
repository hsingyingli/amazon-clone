package db

import (
	"context"
	"time"
)

const createCategory = `
INSERT INTO categories ( 
  title 
) VALUES (
  $1
)
RETURNING id, title, created_at, updated_at
`

type CreateCategoryParam struct {
	Title string
}

func (store *Store) CreateCategory(ctx context.Context, args CreateCategoryParam) (Category, error) {
	row := store.db.QueryRowContext(ctx, createCategory, args.Title)
	var category Category

	err := row.Scan(
		&category.ID,
		&category.Title,
		&category.CreatedAt,
		&category.UpdatedAt,
	)

	return category, err
}

const deleteCategory = `
  DELETE
  FROM categories
  WHERE id = $1
  `

func (store *Store) DeleteCategory(ctx context.Context, id int64) error {
	_, err := store.db.ExecContext(ctx, deleteCategory, id)
	return err
}

const listCategories = `
  SELECT id, title, created_at, updated_at
  FROM categories
  ORDER BY id 
  LIMIT $1
  OFFSET $2
  `

func (store *Store) listCategories(ctx context.Context, limit int, offset int) ([]Category, error) {
	rows, err := store.db.QueryContext(ctx, listCategories, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := []Category{}

	for rows.Next() {
		var category Category
		if err := rows.Scan(
			&category.ID,
			&category.Title,
			&category.CreatedAt,
			&category.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, category)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateCategory = `
  UPDATE categories
  SET title = $2
  SET updated_at = $3
  WHERE id = $1
  RETURNING id, title, created_at, updated_at
`

type UpdateCategoryParam struct {
	ID    int64
	Title string
}

func (store *Store) UpdateCategory(ctx context.Context, args UpdateCategoryParam) (Category, error) {
	row := store.db.QueryRowContext(ctx, updateCategory,
		args.ID,
		args.Title,
		time.Now(),
	)

	var category Category

	err := row.Scan(
		&category.ID,
		&category.Title,
		&category.CreatedAt,
		&category.UpdatedAt,
	)

	return category, err
}
