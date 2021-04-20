'use strict'



require('dotenv').config();



const express = require('express')
const pg = require('pg')
const superagent = require('superagent')
const cors = require('cors')
const methodOverride = require('method-override');
// const { response } = require('express');

const PORT = process.env.PORT
const app = express()



app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
const client = new pg.Client(process.env.DATABASE_URL);




// / routs


app.get('/', homePage)
app.post('/', homePageSearch)
app.get('/all', allCountry)
app.post('/all', insertOnData)
app.get('/myRecord', getDataBase)
app.get('/detail/:id', oneDetail)
app.delete('/detail/:id', deleteOneDetail)
app.put('/detail/:id', updateOneDetail)

// /function
function homePage(request, response) {

    let url = 'https://api.covid19api.com/world/total'
    superagent.get(url).then(result => {
        response.render('index', { homePageResult: result.body })
    })
}

function homePageSearch(request, response) {

    const { country, from, to } = request.body
    let url = `https://api.covid19api.com/country/${country}/status/confirmed?from=${from}T00:00:00Z&to=${to}T00:00:00Z`
    superagent.get(url).then(result => {
        response.render('getCountryResult', { searchArray: result.body })
    })
}
function allCountry(request, response) {
    let url = 'https://api.covid19api.com/summary'
    superagent.get(url).then(result => {
        result.body.Countries.forEach(element => {

            new Covid12(element);
        });
        response.render('AllCountriespage', { AllCountriesPageArray: Covid12.all })
    })

}

function insertOnData(request, response) {
    const { country, totalconfirmed, totaldeaths, totalrecovered, thedate } = request.body
    let values = [country, totalconfirmed, totaldeaths, totalrecovered, thedate]
    let sql = 'INSERT INTO mynew (country, totalconfirmed, totaldeaths,totalrecovered,thedate) VALUES ($1,$2,$3,$4,$5);'
    client.query(sql,values).then(()=>{
        response.redirect('/myRecord')
    })
}



function getDataBase(request, response) {
    let sql='SELECT * FROM mynew;'
    client.query(sql).then(result=>{
        response.render('MyRecords',{MyRecordsArray:result.rows})
    })

}


function oneDetail(request, response) {
    let id = request.params.id
    let sql='SELECT * FROM mynew WHERE id=$1;'
    client.query(sql,[id]).then(result=>{
        response.render('RecordDetails',{element:result.rows[0]})
    })

}

function deleteOneDetail(request, response) {
    
    let id = request.params.id
    let sql='DELETE FROM mynew WHERE id=$1;'
    client.query(sql,[id]).then(()=>{
        response.redirect('/myRecord')
    })
}

function updateOneDetail(request, response) {
    let id = request.params.id
    const { country, totalconfirmed, totaldeaths, totalrecovered, thedate } = request.body
    let values = [country, totalconfirmed, totaldeaths, totalrecovered, thedate,id]
    let sql='UPDATE mynew SET country = $1, totalconfirmed = $2,totaldeaths = $3, totalrecovered = $4, thedate = $5 WHERE id=$6;'
    client.query(sql,values).then(()=>{
        response.redirect(`/detail/${id}`)
    })
}

















// /constructor
// The results should be displayed as cards (each card should have these data: Country, Total Confirmed Cases,
//  Total Deaths Cases, Total Recovered Cases, Date, and add-to-my-records button). 
//  "ID": "0e638cf3-0c44-4392-a274-ee13a325feef",
//  "Country": "Afghanistan",
//  "CountryCode": "AF",
//  "Slug": "afghanistan",
//  "NewConfirmed": 0,
//  "TotalConfirmed": 57793,
//  "NewDeaths": 0,
//  "TotalDeaths": 2539,
//  "NewRecovered": 0,
//  "TotalRecovered": 52168,
//  "Date": "2021-04-19T23:10:50.74Z",
//  "Premium": {}




function Covid12(data) {
    this.country = data.Country
    this.totalconfirmed = data.TotalConfirmed
    this.totaldeaths = data.TotalDeaths
    this.totalrecovered = data.TotalRecovered
    this.thedate = data.Date
    Covid12.all.push(this)
}
Covid12.all = [];



// error


// /end

client.connect().then(() => {
    app.listen(PORT, () => console.log(`your app on ${PORT}`))
})
