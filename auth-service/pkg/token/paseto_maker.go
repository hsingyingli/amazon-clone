package token

import (
	"authentication/pkg/db"
	"fmt"
	"time"

	"github.com/o1egl/paseto"
)

type PasetoMaker struct {
	pasto        *paseto.V2
	symmertickey []byte
}

func (maker PasetoMaker) CreateToken(user db.User, duration time.Duration) (string, error) {
	payload, err := NewPayload(user, duration)

	if err != nil {
		return "", err
	}

	token, err := maker.pasto.Encrypt(maker.symmertickey, payload, nil)
	return token, err
}

func (maker PasetoMaker) VerifyToken(token string) (*Payload, error) {
	var payload Payload
	err := maker.pasto.Decrypt(token, maker.symmertickey, &payload, nil)

	if err != nil {
		return nil, err
	}

	err = payload.Vaild()

	if err != nil {
		return nil, err
	}

	return &payload, err
}

// NewPasetoMaker return token maker which implemented maker interface
func NewPasetoMaker(symmetricKey string) (Maker, error) {
	if len(symmetricKey) != 32 {
		return nil, fmt.Errorf("SymmetricKey must be 32 bytes")
	}

	maker := PasetoMaker{
		pasto:        paseto.NewV2(),
		symmertickey: []byte(symmetricKey),
	}

	return maker, nil
}
