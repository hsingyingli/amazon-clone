package api

import (
	"net/http"
	"product/pkg/db"

	"github.com/gin-gonic/gin"
)

type CreateProductRequest struct {
	Title       string `json:"title"`
	Price       int64  `json:"price"`
	Amount      int64  `json:"amount"`
	Description string `json:"description"`
	ImageUrl    string `json:"imageUrl"`
	Category_id int64  `json:"category_id"`
}

func (server *Server) CreateProduct(ctx *gin.Context) {
	_ = ctx.MustGet(authorizationPayloadKey).(*User)

	var req CreateProductRequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	product, err := server.store.CreateProduct(ctx, db.CreateProductParam{
		Title:       req.Title,
		Price:       req.Price,
		Amount:      req.Amount,
		Description: req.Description,
		ImageUrl:    req.ImageUrl,
		Category_id: req.Category_id,
	})

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, product)
}

func (server *Server) DeleteProductById(ctx *gin.Context) {

}
