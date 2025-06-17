package main

import (
	"database/sql"
	"log"
	"os"
	// "github.com/gorilla/mux"
)

type User struct {
	Id    int    `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

func main() {
	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	_, err = db.Exec("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT, email TEXT)")
	if err != nil {
		log.Fatal(err)
	}

	// now err, because none of this func exists yet
	// router := mux.NewRouter()
	// router.HandleFunc("/api/go/users", getUsers(db)).Methods("GET")
	// router.HandleFunc("/api/go/users", createUsers(db)).Methods("POST")
	// router.HandleFunc("/api/go/users/{id}", getUser(db)).Methods("GET")
	// router.HandleFunc("/api/go/users/{id}", updateUser(db)).Methods("PUT")
	// router.HandleFunc("/api/go/users/{id}", deleteUser(db)).Methods("DELETE")

}
