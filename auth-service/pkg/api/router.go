package api

func (server *Server) setupRouter() {

	server.router.Use(GinMiddleware("http://localhost:3000"))
	v1 := server.router.Group("/v1")
	{
		user := v1.Group("/user")
		{
			// Create User
			user.POST("", server.CreateUser)

			// Login User
			user.POST("/login", server.LoginUser)

			// Logout User
			user.POST("/logout", server.LogoutUser)

			// renew access token
			user.POST("/renew_access", server.RenewAccessToken)

			authorized := user.Group("/auth")
			authorized.Use(authMiddleware(server.tokenMaker))
			{
				// Get User
				authorized.GET("/me")

				// Update User
				authorized.PATCH("/me")

				// DELETE User
				authorized.DELETE("/me")
			}
		}
	}
}
