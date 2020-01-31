const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


const app = express()

//paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
//setup handlebars engine & views directory
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
//serve up static files
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
//     res.send('<H1>Weather</h1>')
    res.render('index', {
        title: 'weather app',
        name: 'ghvst'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About app',
        name: 'ghvst'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        msg: 'immm gonnnaaa helllppp yaaaaa',
        title: 'help page',
        name: 'ghvst'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send ({
            error: 'put in an address'
        })
    }
    console.error(req.query.address);
    
    geocode(req.query.address, (error, { longitude, latitude, location} = {}) => {
        if (error) {
            return res.send({ error })
        }
        forecast (latitude,longitude, (error, forecastData) => {
            if (error) {
                console.log(error)
                return res.send({ error })
            }
            res.send({
            forecast: forecastData,
            location,
            address: req.query.address
            })
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        msg: 'Help article not found',
        title: '404 Page',
        name: 'ghvst'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        msg: 'Page not found',
        title: '404 Page',
        name: 'ghvst'
    })
})

app.listen(3000, () => {
    console.log('server is up on port 3000')
})