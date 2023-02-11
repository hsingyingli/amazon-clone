package api

import (
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"product/pkg/grpc"
)

func GinMiddleware(allowOrigin string) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ctx.Writer.Header().Set("Access-Control-Allow-Origin", allowOrigin)
		ctx.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		ctx.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		ctx.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if ctx.Request.Method == "OPTIONS" {
			ctx.AbortWithStatus(204)
			return
		}

		ctx.Next()
	}
}

const (
	authorizationHeaderKey  = "authorization"
	authorizationTypeBearer = "bearer"
	authorizationPayloadKey = "authorization_key"
)

type User struct {
	Id       int64
	Username string
	Email    string
}

func authMiddleware(GRPC_URL string) gin.HandlerFunc {
	return func(ctx *gin.Context) {

		// user should provide authorization header
		header := ctx.GetHeader(authorizationHeaderKey)
		if len(header) == 0 {
			err := errors.New("authorization header is not provided")
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		// check authorization header format
		// should be bearer access-token
		fields := strings.Fields(header)

		if len(fields) < 2 {
			err := errors.New("invaild authorization header format")
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		authorizationType := strings.ToLower(fields[0])

		// should be bearer
		if authorizationType != authorizationTypeBearer {
			err := errors.New("unsupport authorization type")
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		accessToken := fields[1]

		// send access token to auth service via grpc connection
		response, err := grpc.VerifyToken(ctx, GRPC_URL, accessToken)

		if err != nil || response.User == nil {
			err := errors.New("invalid access token")
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		user := &User{
			Id:       response.User.Uid,
			Email:    response.User.Email,
			Username: response.User.Username,
		}

		// store user in gin ctx
		ctx.Set(authorizationPayloadKey, user)
		ctx.Next()
	}
}
