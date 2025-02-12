# E-commerce server

## PostgreSQL integration

We need to link our server to a database so I chose to use PostgreSQL.

I created the database using `pgAdmin` :
 - Name : **ecommerce**
 - Owner : **postgre**
    - Password : **root**

install `postgresql` in the **node_modules** :
```
npm install pg
```

and I modified the [e-commerce.js](./e-commerce/e-commerce.js) to link the server to the database.

## Frontend

To create a simple frontend, I used **Angular**. 

It is now usable using the following steps (considering you used the same postgresql database with the same credentials on your machine):
 1. Clone the repo
 2. Navigate to `e-commerce`
 3. Install dependencies
 ```
 npm install
 ```
 4. Start Backend API
 ```
 node e-commerce.js
 ```
 5. Navigate to `e-commerce_frontend`
 6. Install dependencies:
 ```
 npm install
 ```
 7. Start the Frontend App
 ```
 ng serve
 ```

