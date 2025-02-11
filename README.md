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

To create a simple frontend, I install **Angular** :
```
npm install -g @angular/cli
```
And create a simple app :
```
ng new ecommerce-app --minimal --skip-tests
```
