package grpc

import (
	"github.com/gin-gonic/gin"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"product/proto"
)

func VerifyToken(ctx *gin.Context, grpcURL string, token string) (*proto.AuthResponse, error) {

	conn, err := grpc.Dial(grpcURL,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithBlock(),
	)

	if err != nil {
		return nil, err
	}

	defer conn.Close()

	client := proto.NewAuthServiceClient(conn)

	response, err := client.VerifyToken(ctx, &proto.AuthRequest{
		Token: token,
	})

	return response, err
}
