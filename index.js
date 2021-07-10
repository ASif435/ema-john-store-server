const express = require('express');
require('dotenv').config();
const bodyParser= require('body-parser');
const cors = require('cors')
const app = express();
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors());

const user = process.env.DB_User;
const pass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;

const port =4000;
const uri= `mongodb+srv://${user}:${pass}@cluster0.okztc.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const { MongoClient } = require('mongodb');

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect(err => {
        const productsCollection = client.db("emaJohnDb").collection("products");
        const orderCollection = client.db("emaJohnDb").collection("orders");
            
        app.post('/addProduct',(req,res)=>{
            const products = req.body;
            productsCollection.insertMany(products)
            .then(result=>{
                console.log(result.insertedCount)
                res.send(result.insertedCount)
            });
        });

        app.get('/products',(req,res)=>{
            productsCollection.find({}).limit(20)
            .toArray((err,document)=>{
                res.send(document)
            })
        });
        app.get('/product/:key',(req,res)=>{
            productsCollection.find({key:req.params.key})
            .toArray((err,document)=>{
                res.send(document[0])
            })
        });
        app.post('/productByKeys',(req,res)=>{
            const productkey = req.body;
            productsCollection.find({key:{$in: productkey}})
            .toArray((err,documents)=>{
                res.send(documents)
            });
        });

    
     app.post('/addOrder',(req,res)=>{
            const orders = req.body;
            orderCollection.insertMany(orders)
            .then(result=>{
                
                res.send(result.insertedCount >0)
            })
        })

        });








app.get('/',(req,res)=>{
    res.send('working')
})
// app.listen(port,()=>{
//    console.log( `your server run port is ${port}`)
// })
app.listen(process.env.PORT ||port)