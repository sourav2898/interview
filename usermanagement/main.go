package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"
)

var (
	m     sync.Mutex
	memDB = make(InMemoryDB)
)

//InMemoryDB ...
type InMemoryDB map[string]User

//InsertOne ...
func (mdb InMemoryDB) InsertOne(u User) {
	m.Lock()
	defer m.Unlock()
	mdb[u.Email] = u
}

//FindOne ...
func (mdb InMemoryDB) FindOne(userID string) (User, error) {
	m.Lock()
	defer m.Unlock()
	u, ok := mdb[userID]
	if !ok {
		return u, errors.New("user does not exist")
	}
	return u, nil
}

//User ...
type User struct {
	FirstName string `json:"firstname"`
	LastName  string `json:"lastname"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	CartID    string `json:"cartId"`
}

//UserLogin ...
type UserLogin struct {
	Password string `json:"password"`
}

//AuthToken ...
type AuthToken struct {
	TokenType string `json:"token_type"`
	Token     string `json:"access_token"`
	ExpiresIn int64  `json:"expires_in"`
}

//Response ...
type Response struct {
	Error  string `json:"error,omitempty"`
	Result string `json:"result,omitempty"`
}

func getHash(pwd []byte) string {
	hash, err := bcrypt.GenerateFromPassword(pwd, bcrypt.MinCost)
	if err != nil {
		log.Println(err)
	}
	return string(hash)
}

//GenerateJWT ...
func GenerateJWT(user, password string) ([]byte, error) {
	reqBody := map[string]interface{}{
		"username": user,
		"password": password,
	}
	byt, err := json.Marshal(reqBody)
	if err != nil {
		return nil, err
	}
	url := "http://localhost:3000/token"
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(byt))
	if err != nil {
		log.Println("error while creating request :", err)
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Println("error while making request: ", err)
		return nil, err
	}
	defer resp.Body.Close()
	token, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Println("error while reading response body: ", err)
		return nil, err
	}
	return token, nil
}

//Signup ...
func Signup(w http.ResponseWriter, r *http.Request) {
	resp := Response{}
	w.Header().Set("Content-Type", "application/json")
	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"message":"` + err.Error() + `"}`))
		return
	}
	user.Password = getHash([]byte(user.Password))

	_, err := memDB.FindOne(user.Email)
	if err != nil {
		memDB.InsertOne(user)
		resp.Result = "registration successful!"
		w.WriteHeader(http.StatusCreated)
	} else {
		resp.Error = "username already exist!"
		w.WriteHeader(http.StatusConflict)
	}

	if err := json.NewEncoder(w).Encode(resp); err != nil {
		resp.Error = err.Error()
		w.WriteHeader(http.StatusInternalServerError)
	}
	//TODO: create cart and assign on yourself
	//usually this should be done when email verification is done
	//actual implementation will be done through GRPC
}

//Login ...
func Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	userID := params["userID"]
	var user UserLogin
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"message":"` + err.Error() + `"}`))
		return
	}
	storedUser, err := memDB.FindOne(userID)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"message": "invalid username or password"}`))
		return
	}
	password := []byte(user.Password)
	storedPassword := []byte(storedUser.Password)
	err = bcrypt.CompareHashAndPassword(storedPassword, password)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"message":"invalid username or password"}`))
		return
	}
	jwtToken, err := GenerateJWT(userID, user.Password)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"message":"` + err.Error() + `"}`))
		return
	}
	w.Write(jwtToken)

}

func main() {
	log.Println("Starting the application at port :3030")

	router := mux.NewRouter()

	router.HandleFunc("/users/{userID}/login", Login).Methods("POST", "OPTION")
	router.HandleFunc("/signup", Signup).Methods("POST", "OPTION")
	//TODO: write a GET call

	headersOption := handlers.AllowedHeaders([]string{"X-Requested-With", "Origin", "Accept", "Content-Type", "Authorization"})
	methodsOption := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "PATCH", "HEAD", "OPTIONS"})
	originsOption := handlers.AllowedOrigins([]string{"*"})
	credentialOption := handlers.AllowCredentials()

	log.Fatal(http.ListenAndServe(":3030", handlers.CORS(headersOption, methodsOption, originsOption, credentialOption)(router)))

}