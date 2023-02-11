package grpc

import (
	"authentication/pkg/token"
	"authentication/proto"
	"context"
	"log"
	"net"

	"google.golang.org/grpc"
)

type AuthServer struct {
	proto.UnimplementedAuthServiceServer
	tokenMaker token.Maker
}

func (authServer *AuthServer) VerifyToken(ctx context.Context, req *proto.AuthRequest) (*proto.AuthResponse, error) {
	token := req.GetToken()

	payload, err := authServer.tokenMaker.VerifyToken(token)

	if err != nil {
		res := &proto.AuthResponse{
			IsAuth: false,
		}
		return res, err
	}

	user := proto.User{
		Uid:      payload.UID,
		Username: payload.Username,
		Email:    payload.Email,
	}

	res := &proto.AuthResponse{
		User: &user,
	}

	return res, nil
}

func GRPCListen(port string, tokenMaker token.Maker) {
	lis, err := net.Listen("tcp", port)

	if err != nil {
		log.Fatalf("1. Fail to listen for gRPC: %v", err)
	}

	s := grpc.NewServer()

	proto.RegisterAuthServiceServer(s, &AuthServer{tokenMaker: tokenMaker})

	log.Printf("gRPC server started on port: %v\n", port)

	if err = s.Serve(lis); err != nil {
		log.Fatalf("2. Fail to listen for gRPC: %v", err)
	}
}
