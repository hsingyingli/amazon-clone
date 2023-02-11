package api

import (
	"product/pkg/db"
	"product/pkg/util"

	"github.com/gin-gonic/gin"
)

// define server struct
type Server struct {
	config util.Config
	router *gin.Engine
	store  *db.Store
}

func NewServer(config util.Config, store *db.Store) *Server {

	server := &Server{
		config: config,
		router: gin.Default(),
		store:  store,
	}

	server.setupRouter()

	return server
}

func (server *Server) Start(port string) error {
	return server.router.Run(port)
}
