package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type RenewAccessTokenResponse struct {
	AccessToken string `json:"accessToken"`
	Username    string `json:"username"`
	Email       string `json:"email"`
	Id          int64  `json:"id"`
}

func (server *Server) RenewAccessToken(ctx *gin.Context) {
	refreshToken, err := ctx.Cookie("amazon-clone-refresh-token")

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not authorized"})
		return
	}

	payload, err := server.tokenMaker.VerifyToken(refreshToken)

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not authorized"})
		return
	}

	user, err := server.store.GetUserById(ctx, payload.UID)

	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
	}

	accessToken, err := server.tokenMaker.CreateToken(user, server.config.ACCESS_TOKEN_DURATION)

	rsp := RenewAccessTokenResponse{
		AccessToken: accessToken,
		Username:    user.Username,
		Email:       user.Email,
		Id:          user.ID,
	}

	ctx.JSON(http.StatusOK, rsp)
}
