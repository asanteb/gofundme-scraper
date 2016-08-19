# gofundme-scraper

## Startup 
 ```node
    npm install
    node server
```
## Prerequisites

1. mongodb

## Ports

- Mongodb port: 27017 || default
- Server port: 8112

## MongoDB
MongoDB database name is 'gofundme'. Be sure to create an admin user for the db if you are using a mongo-admin

## Warnings
Running without waiting periods or timeouts will result in an instant ban from GoFundMe.com
- safe period appears to be 2-3 cycles in 5 minutes of 50 page scrapes per IP/Proxy
- ip-rotation/proxy implementation is needed for massive scrapes.
