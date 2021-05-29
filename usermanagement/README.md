User Management Service 
Description: This is a quick prototype mainly intended for interview purpose

```
API: /signup
Method: POST
Body:
    {
	    "firstname": "something",
	    "lastname": "something",
	    "email": "test@test.com",
	    "password": "test"
    }

API: /users/{userID}/login
Method: POST
Body:
    {
	    "password": "test"
    }
```

