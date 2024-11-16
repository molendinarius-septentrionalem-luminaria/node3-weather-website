const request = require('request')

// const forecast = (latitude, longitude, callback) => {
//     const url = 'https://api.weatherstack.com/current?access_key=ffec199872d41c977f560987711d2f5e&query=' + latitude +','+ longitude +'&units=m'
//     request ({ url, json: true }, (error, { body }) =>{
//         //const {weather_descriptions:weather, temperature, precip} = response.body.current 
//         if (error) {
//             callback('Unable to connect to weather service', undefined)
//         } else if (body.error) {
//             callback('Unable to find location', undefined)
//         } else {
//             callback(undefined,
//                 'The weather is ' 
//                 + body.current.weather_descriptions 
//                 + '. It is currently ' 
//                 + body.current.temperature 
//                 + ' degrees Celsius. There is ' 
//                 + body.current.precip 
//                 + '% chance to rain.')
//         }
//     })
// }

// module.exports = forecast

const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&current=temperature_2m,cloud_cover&hourly=precipitation_probability'
    request ({ url, json: true }, (error, { body }) =>{
        if (error) {
            callback('Unable to connect to weather service', undefined)
        } else if (body.error) {
            callback('Unable to find location', undefined)
            console.log(url)
        } else {
            callback(undefined,
                'It is currently ' 
                + body.current.temperature_2m 
                + body.current_units.temperature_2m + '. There is '
                + body.hourly.precipitation_probability[0]
                + '% chance to rain. Cloud cover is '
                + body.current.cloud_cover + '%.')
        }
    })
}

module.exports = forecast