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
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&current=temperature_2m,cloud_cover&hourly=precipitation_probability&daily=temperature_2m_max,temperature_2m_min,snowfall_sum,wind_speed_10m_max'
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
                + body.current.cloud_cover + '%.'
                + ' Today: minimum temparature is ' + body.daily.temperature_2m_min[0]
                + body.daily_units.temperature_2m_min + ' and the maximum is ' 
                + body.daily.temperature_2m_max[0] + body.daily_units.temperature_2m_max + '.'
                + ' Snowfall ' + body.daily.snowfall_sum[0] + body.daily_units.snowfall_sum + '.'
                + ' Maximum wind speed ' + body.daily.wind_speed_10m_max[0] + body.daily_units.wind_speed_10m_max
                + '.'
            )
        }
    })
}

module.exports = forecast