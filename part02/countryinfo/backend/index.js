require('dotenv').config();
const express = require("express");
const app = express();
const port = 3001; 
var cors = require('cors')
app.use(cors())
app.use(express.json());
app.get("/",(req,res) => {
    res.send("Hello World")
})
app.get("/api/weather",(req,res) => {
   fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${req.query.latitude}&lon=${req.query.longitude}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric`)
    .then(resp => resp.json())
    .then(result => {console.log(result); res.json(result).end();})
})

app.listen(port, () => {
    console.log(`Example app running on port ${port}`)
})