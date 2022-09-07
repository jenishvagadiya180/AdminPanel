import express from 'express';
import dotenv from 'dotenv';
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import connectDB from './db/connectdb.js';
import admin from './routes/user.js';
import category from './routes/category.js'
import product from './routes/product.js'
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import errorhandler from './error/handler.js'

dotenv.config();
const app = express();

const port = process.env.PORT;

//Database Connection
connectDB();

//swagger
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: 'node js setup',
      version: '1.0.0',
      description: "Express API for Nodejs"
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
      },
    },
    security: [{
      bearerAuth: []
    }],
  },
  apis: ["./swagger/user.js", "./swagger/category.js", "./swagger/product.js"]
};

const swaggerSpec = swaggerJSDoc(options);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use("/uploads", express.static('uploads'));

// create application/json parser
app.use(bodyParser.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// set EJS as template engine
app.set('view engine', 'ejs');

//Routes
app.use(express.static('views'));
app.use(express.json())
app.use(fileUpload());
app.use("/admin/user", admin);
app.use("/admin/category", category);
app.use("/admin/product", product);
app.use(errorhandler)
app.use((req, res) => { res.status(404).render("error404") })

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
})


