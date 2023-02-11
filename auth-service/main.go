package main

import (
	"authentication/pkg/api"
	"authentication/pkg/db"
	"authentication/pkg/grpc"
	"authentication/pkg/token"
	"authentication/pkg/util"
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func main() {

	// step 1: read config
	config, err := util.LoadConfig("./config")
	if err != nil {
		log.Fatal(err)
	}

	// step 2: connect to database
	dbName := config.DB_NAME
	dbSource := fmt.Sprintf("postgresql://%s:%s@%s:%s/%s?sslmode=disable", config.DB_USERNAME, config.DB_PASSWORD, config.DB_URL, "5432", config.DB_DATABASE)
	conn, err := sql.Open(dbName, dbSource)

	if err != nil {
		log.Fatal(err)
	}

	// step 3: registe all db operations
	store := db.NewStore(conn)

	// step 4: define token maker for auth
	tokenMaker, err := token.NewPasetoMaker(config.SYMMERTICKEY)

	if err != nil {
		log.Fatal(err)
	}

	// step 5: start gRPC server for handling
	// auth operation from other microservices
	go grpc.GRPCListen(config.GRPC_PORT, tokenMaker)

	// step 6: Listen and Serve
	server := api.NewServer(config, store, tokenMaker)

	err = server.Start(config.PORT)
	if err != nil {
		log.Fatal(err)
	}
}
