const express = require('express');
const router = require('./routes');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.send("Final Project 3");
});

app.use(router);

app.listen(PORT, () => {
    console.log(`App Running on PORT: ${PORT}`)
});