Authentication Service
Description: This is a quick prototype mainly intended for interview purpose

```
API: /token
Method: POST
Body:
{
    "username": "something",
    "password": "something"
}

API: /users/{userId}/validateToken
Method: GET
Header 
authorization -> Bearer <token received>
```