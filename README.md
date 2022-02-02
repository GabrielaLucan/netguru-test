# netguru-test
This is a repository which holds Netguru Test REST APIs.

* [Usage](#usage)
* [Technologies](#technologies)
* [Setup](#setup)
* [Example request](#Example request)



## Usage
Project supports request to the following APIs:
- GET ​/movies - Retrieves a list of movies
- POST ​/movies - Create a movie based on the title given in body


## Technologies
Project is created with:
- node: v16.13.1

## Setup
In order to start this project you must have a valid mongoDB connection string and an omdb api token.
Once you have it, create a .env file and store it in MONGO_URL variable.
Other secrets needed:
 - OMDB_API_KEY: omdb api token
 - JWT_SECRET: jwt secret

To run this project:
* download and install
* run the npm:
```
$ cd ../netguru-test
$ npm install
$ npm start
```

## Example request
Requests should be authorized using an Authorization Bearer Token.

Example request to obtain the token:

Request

```
curl --location --request POST 'http://localhost:3000/auth' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "your-username-here",
    "password": "your-password-here"
}'
```

Response

```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywibmFtZSI6IkJhc2ljIFRob21hcyIsInJvbGUiOiJiYXNpYyIsImlhdCI6MTYwNjIyMTgzOCwiZXhwIjoxNjA2MjIzNjM4LCJpc3MiOiJodHRwczovL3d3dy5uZXRndXJ1LmNvbS8iLCJzdWIiOiIxMjMifQ.KjZ3zZM1lZa1SB8U-W65oQApSiC70ePdkQ7LbAhpUQg"
}
```

Example request to create a movie:

Request

```
curl --location --request POST 'http://localhost:3000/movies' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_TOKEN' \
--data-raw '{
    "title": "scarface"
}'
```

Response

```
{
    "movie": {
            "_id": "61f8260e966fa51b3806580c",
            "title": "scarface",
            "released": "09 Dec 1983",
            "genre": "Crime, Drama",
            "director": "Brian De Palma",
            "createdAt": "2022-01-31T18:10:22.423Z",
            "updatedAt": "2022-01-31T18:10:22.423Z",
    }
}
```

## Run locally

1. Clone this repository
2.1. Run with docker compose

```
docker-compose up -d --build
```

To stop the server run

```
docker-compose down
```
