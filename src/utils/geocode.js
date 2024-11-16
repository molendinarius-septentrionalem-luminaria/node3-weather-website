const request = require('request')

const geocode = (address, callback) => {
    const url = 'https://api.mapbox.com/search/geocode/v6/forward?q=' + encodeURIComponent(address) + '&access_token=pk.eyJ1IjoibW9sbmFybm9yYmVydCIsImEiOiJjbTNobGgwZmkwZWZkMmlxeno3dDA4dW8zIn0.1lG6tdlgb9jlDXjwJ5LkBQ&limit=1'

    request({ url, json: true}, (error, response)=>{
        if (error){
            callback('Unable to connect to location services', undefined)
        } else if (!response.body.features || response.body.features.length === 0) {
            callback('Unable to find location. Try another search', undefined)
        } else {
            const {latitude, longitude} = response.body.features[0].properties.coordinates 
            const {full_address:location} = response.body.features[0].properties 
            callback(undefined, {
                latitude,
                longitude,
                location
            })
            
        }
    })
}
// geocode('budapest', (error, { latitude, longitude, location } = {}) => {
//     console.log(latitude, longitude, location)
// } )
module.exports = geocode