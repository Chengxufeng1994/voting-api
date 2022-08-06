# voting-api

## Getting Started

### 1. skaffold

* Step 1

```
minikube start

minikube addon enable ingress

minikube tunnel
```

* Step 2

```
skaffold dev --no-prune=false --cache-artifacts=false --no-prune-children=false
```

* Step3  
modified /etc/hosts/

```
127.0.0.1 voting.io
```

### 2. docker-compose

```
docker-compose up -d --build
```

## How to use (POSTMAN)

### 1. Create a admin user

POST <http://localhost:3000/api/users/signup>  
body:

```
{
  "identity": "A123456(7)",
  "email": "admin@voting.io",
  "remark": "admin"
}
```

response:

```
{
  "email": "admin@voting.io",
  "remark": "admin",
  "created_at": "2022-08-06T03:21:17.271Z",
  "updated_at": "2022-08-06T03:21:17.271Z",
  "id": "62edde2d8e74da8df646cb27"
}
```

### 2. Create a poll

POST <http://localhost:3000/api/polls/>   
body:

```
{
  "topic": "test"
}
```

response:

```
{
  "user": "62edde2d8e74da8df646cb27",
  "topic": "test",
  "options": [],
  "voted": [],
  "seen": [],
  "inProgress": false,
  "created_at": "2022-08-06T03:34:08.904Z",
  "updated_at": "2022-08-06T03:34:08.904Z",
  "_id": "62ede13091424d6d8b2e20b2",
  "__v": 0
}
```

### 3. Create a option to poll

POST <http://localhost:3000/api/options/>   
body:

```
{
  "pollId": "62ede13091424d6d8b2e20b2",
  "option": "option 1"
}
```

response:

```
{
  "poll": "62ede13091424d6d8b2e20b2",
  "option": "option 1",
  "created_at": "2022-08-06T03:36:08.353Z",
  "updated_at": "2022-08-06T03:36:08.353Z",
  "_id": "62ede1a891424d6d8b2e20b6",
  "__v": 0
}
```

POST <http://localhost:3000/api/options/>   
body:

```
{
  "pollId": "62ede13091424d6d8b2e20b2",
  "option": "option 2"
}
```

response:

```
{
  "poll": "62ede13091424d6d8b2e20b2",
  "option": "option 2",
  "created_at": "2022-08-06T03:36:59.853Z",
  "updated_at": "2022-08-06T03:36:59.853Z",
  "_id": "62ede1db91424d6d8b2e20bb",
  "__v": 0
}
```

### 4. Start a poll
POST <http://localhost:3000/api/polls/start/62ede13091424d6d8b2e20b2>   

response:

```
{
  "user": "62edde2d8e74da8df646cb27",
  "topic": "test",
  "options": [
    "62ede1a891424d6d8b2e20b6",
    "62ede1db91424d6d8b2e20bb"
  ],
  "voted": [],
  "seen": [],
  "inProgress": true,
  "created_at": "2022-08-06T03:34:08.904Z",
  "updated_at": "2022-08-06T03:38:26.676Z",
  "_id": "62ede13091424d6d8b2e20b2",
  "__v": 2
}
```

### 5. Add vote
POST <http://localhost:3000/api/votes/>   
body:
```
{
  "pollId": "62ede13091424d6d8b2e20b2",
  "optionId": "62ede1a891424d6d8b2e20b6"
}
```

response:
```
{
  "poll": "62ede13091424d6d8b2e20b2",
  "user": "62edde2d8e74da8df646cb27",
  "option": "62ede1a891424d6d8b2e20b6",
  "created_at": "2022-08-06T03:42:05.332Z",
  "updated_at": "2022-08-06T03:42:05.332Z",
  "_id": "62ede30d91424d6d8b2e20c4",
  "__v": 0
}
```

### 6. Get Current vote situation
POST <http://localhost:3000/api/votes/current/62ede13091424d6d8b2e20b2>  
response:
```
{
  "options": [
    {
      "_id": {
        "_id": "62ede1a891424d6d8b2e20b6",
        "poll": "62ede13091424d6d8b2e20b2",
        "option": "option 1",
        "created_at": "2022-08-06T03:36:08.353Z",
        "updated_at": "2022-08-06T03:36:08.353Z",
        "__v": 0
      },
      "total": 1
    }
  ],
  "votes": [
    {
      "_id": "62ede30d91424d6d8b2e20c4",
      "poll": "62ede13091424d6d8b2e20b2",
      "user": "62edde2d8e74da8df646cb27",
      "option": "62ede1a891424d6d8b2e20b6",
      "created_at": "2022-08-06T03:42:05.332Z",
      "updated_at": "2022-08-06T03:42:05.332Z",
      "__v": 0
    }
  ]
}
```