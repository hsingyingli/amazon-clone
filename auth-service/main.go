package main

import (
	"authentication/pkg/api"
	"authentication/pkg/db"
	"authentication/pkg/token"
	"authentication/pkg/util"
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func main() {
	config, err := util.LoadConfig("./config")
	if err != nil {
		log.Fatal(err)
	}

	// connect to db
	dbName := config.DB_NAME
	dbSource := fmt.Sprintf("postgresql://%s:%s@%s:%s/%s?sslmode=disable", config.DB_USERNAME, config.DB_PASSWORD, config.DB_URL, "5432", config.DB_DATABASE)
	conn, err := sql.Open(dbName, dbSource)

	if err != nil {
		log.Fatal(err)
	}

	// define sql service
	store := db.NewStore(conn)

	// define token service
	tokenMaker, err := token.NewPasetoMaker(config.SYMMERTICKEY)

	if err != nil {
		log.Fatal(err)
	}

	server := api.NewServer(config, store, tokenMaker)
	err = server.Start(config.PORT)
	if err != nil {
		log.Fatal(err)
	}
}
