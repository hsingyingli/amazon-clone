package db

import (
	"context"
)

const createUser = `
INSERT INTO users ( 
  username, email, password
) VALUES (
  $1, $2, $3
)
RETURNING id, username, email, password, created_at, updated_at
`

type CreateUserParam struct {
	Username string
	Email    string
	Password string
}

func (store *Store) CreateUser(ctx context.Context, args CreateUserParam) (User, error) {
	row := store.db.QueryRowContext(ctx, createUser, args.Username, args.Email, args.Password)
	var user User

	err := row.Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	return user, err
}

const deleteUser = `
  DELETE
  FROM users
  WHERE id = $1
  `

func (store *Store) DeleteUser(ctx context.Context, id string) error {
	_, err := store.db.ExecContext(ctx, deleteUser, id)
	return err
}

const getUserByEmail = `
  SELECT *
  FROM users 
  WHERE email = $1 LIMIT 1
  `

func (store *Store) GetUserByEmail(ctx context.Context, email string) (User, error) {
	row := store.db.QueryRowContext(ctx, getUserByEmail, email)
	var user User

	err := row.Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	return user, err
}

const getUserById = `
  SELECT *
  FROM users
  WHERE id = $1 LIMIT 1
  `

func (store *Store) GetUserById(ctx context.Context, id int64) (User, error) {
	row := store.db.QueryRowContext(ctx, getUserById, id)

	var user User

	err := row.Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	return user, err
}
