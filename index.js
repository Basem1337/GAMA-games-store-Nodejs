const express = require('express');
const app = express();
const port = 3000;
const bodyParser=require('body-parser');
const morgan=require('morgan');
const mongoose=require('mongoose');
const cors=require('cors');
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(express.json());
require('dotenv/config');
const api=process.env.API_URL;
app.use(cors());
app.options('*',cors());




const Product = require('./models/Game');
const GameRoute=require('./routers/GameRoutes');
const Category = require('./models/category');
const CategoryRoute=require('./routers/Categories');
const userRoutes = require("./routers/users.js")


app.use((req, res, next) => {
    console.log('Raw Body:', req.body);
    next();
});

//connection to db
//  mongoose.connect('mongodb+srv://alaaalsayed231:nodejs_123@gamestoredb.sg6p3.mongodb.net/?retryWrites=true&w=majority&appName=GAMEStoreDB', {
    mongoose.connect('mongodb+srv://basem1337:bmAdmin1337@gama.gz7sz.mongodb.net/sales?retryWrites=true&w=majority&appName=GAMA', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));




app.use('/uploads', express.static('uploads'));

app.use('/products/games',GameRoute);
app.use('/category',CategoryRoute);
app.use("/users",userRoutes)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})