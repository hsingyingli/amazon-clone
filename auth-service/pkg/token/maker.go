package token

import (
	"authentication/pkg/db"
	"time"
)

type Maker interface {
	CreateToken(user db.User, duration time.Duration) (string, error)
	VerifyToken(token string) (*Payload, error)
}
