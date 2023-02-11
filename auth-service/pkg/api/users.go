package api

import (
	"authentication/pkg/db"
	"authentication/pkg/util"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CreateUserRequest struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type CreateUserResponse struct {
	ID       int64  `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
}

func (server *Server) CreateUser(ctx *gin.Context) {
	var req CreateUserRequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashedPassword, err := util.HashPassword(req.Password)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := server.store.CreateUser(ctx, db.CreateUserParam{
		Username: req.Username,
		Email:    req.Email,
		Password: hashedPassword,
	})

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rsp := CreateUserResponse{
		ID:       user.ID,
		Username: user.Username,
		Email:    user.Email,
	}

	ctx.JSON(http.StatusOK, rsp)
}

type LoginUserRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginUserResponse struct {
	AccessToken string `json:"accessToken"`
	Username    string `json:"username"`
	Email       string `json:"email"`
	Id          int64  `json:"id"`
}

func (server *Server) LoginUser(ctx *gin.Context) {
	var req LoginUserRequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := server.store.GetUserByEmail(ctx, req.Email)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = util.CheckPassword(user.Password, req.Password)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	accessToken, err := server.tokenMaker.CreateToken(user, server.config.ACCESS_TOKEN_DURATION)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	refreshToken, err := server.tokenMaker.CreateToken(user, server.config.REFRESH_TOKEN_DURATION)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rsp := LoginUserResponse{
		AccessToken: accessToken,
		Username:    user.Username,
		Email:       user.Email,
		Id:          user.ID,
	}
	maxage := server.config.REFRESH_TOKEN_DURATION.Microseconds()
	ctx.SetCookie("amazon-clone-refresh-token", refreshToken, int(maxage), "/", "localhost", false, true)

	// generate token
	ctx.JSON(http.StatusOK, rsp)
}

func (server *Server) LogoutUser(ctx *gin.Context) {
	_, err := ctx.Cookie("amazon-clone-refresh-token")

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Not authorized"})
		return
	}

	ctx.SetCookie("refresh_token", "", -1, "/", "localhost", false, true)
	ctx.JSON(http.StatusOK, gin.H{"status": "ok"})
}
