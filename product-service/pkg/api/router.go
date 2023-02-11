package api

func (server *Server) setupRouter() {

	// handle cors
	server.router.Use(GinMiddleware("http://localhost:3000"))
	v1 := server.router.Group("/v1")
	{
		product := v1.Group("/product")

		// check if vailded access token is provided
		product.Use(authMiddleware(server.config.GRPC_URL))
		{
			product.POST("", server.CreateProduct)
		}
	}

}
