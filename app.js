const request = require('request');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.set('view engine', 'ejs');

var API_KEY = '62a1eca5b7a37c639707641226dc08e4';

app.get('/', (req, res) => { //Homepage
    res.sendFile(path.join(__dirname, 'views/home.html'));
})

app.post('/', (req, res) => {
    res.redirect('/weather'); //Redirects to /weather GET
})

app.get('/404', (req, res) => { 
    res.render('404'); //Loads 404.ejs
})

app.post('/404', (req, res) => { 
    res.redirect('/weather'); //Redirects to /weather GET
})

app.get('/weather', async (req, res) => { //Weather search page (without input)
    let city_name = 'Lucknow';
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${API_KEY}&units=metric`;
    request({ url: url, json: true }, function (error, response) {
        if (error) {
            console.log('Unable to connect to Forecast API');
        }
        else {
            let city = response.body.name;
            let ctemp = response.body.main.temp;
            let ftemp = response.body.main.feels_like;
            let maxtemp = response.body.main.temp_max;
            let mintemp = response.body.main.temp_min;
            let hum = response.body.main.humidity;
            let winds = response.body.wind.speed;
            let wtype = response.body.weather[0].main; //Weather type: rain, sunny, etc.
            let wtype_des = response.body.weather[0].description;
            let wicon2 = response.body.weather[0].icon;
            let wicon = `https://openweathermap.org/img/wn/${wicon2}@2x.png`;
            res.render('index', {city: city, ctemp: ctemp, ftemp: ftemp, maxtemp: maxtemp, mintemp: mintemp, hum: hum, winds: winds, wtype: wtype, wicon: wicon, wtype_des: wtype_des});
        }
    })
})

app.post('/weather', (req, res) => { //After search input
    let city_name = req.body.search_city;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${API_KEY}&units=metric`;
    request({ url: url, json: true }, function (error, response) {
        if (error) {
            console.log('Unable to connect to Forecast API');
            res.status(404);
        }
        else {
            if(!response.body.id){
                res.status(404);
                res.redirect('/404');
            }
            else{
                let city = response.body.name;
                let ctemp = response.body.main.temp;
                let ftemp = response.body.main.feels_like;
                let maxtemp = response.body.main.temp_max;
                let mintemp = response.body.main.temp_min;
                let hum = response.body.main.humidity;
                let winds = response.body.wind.speed;
                let wtype = response.body.weather[0].main; //Weather type: rain, sunny, etc.
                let wtype_des = response.body.weather[0].description;
                let wicon2 = response.body.weather[0].icon;
                let wicon = `https://openweathermap.org/img/wn/${wicon2}@2x.png`;
                res.render('index', {city: city, ctemp: ctemp, ftemp: ftemp, maxtemp: maxtemp, mintemp: mintemp, hum: hum, winds: winds,  wtype: wtype,  wicon: wicon, wtype_des: wtype_des});
            }
        }
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})