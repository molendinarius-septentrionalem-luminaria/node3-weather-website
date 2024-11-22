const path = require('path')
const express = require('express')
const hbs = require('hbs')
// Helper a JSON adatok átadásához
hbs.registerHelper('json', (context) => JSON.stringify(context));

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

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

const fs = require('fs');

const saveSearch = (address) => {
    const filePath = './search.json'; // A fájl neve, ahol mented a kereséseket
    let searches = [];

    try {
        const dataBuffer = fs.readFileSync(filePath);
        searches = JSON.parse(dataBuffer.toString());
    } catch (e) {
        // Ha a fájl nem létezik, üres tömböt használunk
    }

    // Ha az address már szerepel, töröld az ismétlést
    searches = searches.filter(search => search !== address);

    // Tedd az új keresést a lista elejére
    searches.unshift(address);

    // Tartsd meg az utolsó 5 keresést
    if (searches.length > 5) {
        searches = searches.slice(0, 5);
    }

    // Írd vissza a frissített listát a fájlba
    fs.writeFileSync(filePath, JSON.stringify(searches));
};

app.get('', (req, res) => {
    let searches = [];

    try {
         // Beolvassuk a keresési adatokat
        const dataBuffer = fs.readFileSync('./search.json');
        searches = JSON.parse(dataBuffer.toString());
    } catch (e) {
        // Ha nincs fájl, hagyjuk üresen a keresési listát
        searches = []
    }
    // Az adatok továbbítása az index.hbs-nek
    res.render('index', {
        title: 'Weather App',
        name: 'Norbert Molnar',
        searches // Az index.hbs megkapja a kereséseket
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
        message: 'Here you can find the FAQ',
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
                        saveSearch(req.query.address); // Mentjük a keresést
                        
                        // Beolvassuk az új keresési listát
                        let searches = [];
                        try {
                            const dataBuffer = fs.readFileSync('./search.json');
                            searches = JSON.parse(dataBuffer.toString());
                        } catch (e) {
                            searches = [];
                        }
                        
                        // Visszaküldjük az adatokat + frissített keresési listát
                        res.send({
                            forecast: forecastData,
                            location,
                            address: req.query.address,
                            searches                            
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

app.listen(port, () => {
    console.log('Server is up on port: ' + port)
})