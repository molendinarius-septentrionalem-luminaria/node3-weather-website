const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPaths = path.join(__dirname, '../templates/views')
const partialsPaths = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPaths)
hbs.registerPartials(partialsPaths)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))


app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Norbert Molnar'
    })
})

app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About me',
        name: 'Norbert Molnar'
    })
})

app.get('/help', (req,res) => {
    res.render('help', {
        title: 'Help page',
        name: 'Norbert Molnar',
        message: 'Here you can find FAQ if you find yourself lost',
        button: 'Click here'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        res.send({
            error: 'You must provide an address'
        }) 
    }else {
        geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
            if (error) {
                res.send({ error })
            } else {
                forecast(latitude, longitude, (error, forecastData) => {
                    if (error) {
                        res.send({ error })
                    } else {
                        res.send({
                            forecast: forecastData,
                            location,
                            address: req.query.address                            
                        })
                    }
                })
            }
        })
    }
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        res.send({
            error: 'You must provide a search term'
        })
    } else {
        console.log(req.query.search)
        res.send({
            products: []
        })
    }
    
})

app.get('/help/*', (req, res) => { //404 a help könyvtárra formázva
    res.render('404', {
        title: '404 page',
        name: 'Norbert Molnar',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404 page',
        name: 'Norbert Molnar',
        errorMessage: 'Page not found'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000')
})