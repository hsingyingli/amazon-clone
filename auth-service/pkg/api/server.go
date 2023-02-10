package api

import (
	"authentication/pkg/db"
	"authentication/pkg/token"
	"authentication/pkg/util"

	"github.com/gin-gonic/gin"
)

type Server struct {
	config     util.Config
	router     *gin.Engine
	store      *db.Store
	tokenMaker token.Maker
}

func NewServer(config util.Config, store *db.Store, tokenMaker token.Maker) *Server {

	server := &Server{
		config:     config,
		router:     gin.Default(),
		store:      store,
		tokenMaker: tokenMaker,
	}

	server.setupRouter()

	return server
}

func (server *Server) Start(port string) error {
	return server.router.Run(port)
}
