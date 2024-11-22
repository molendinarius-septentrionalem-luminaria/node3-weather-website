const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')
const recentSearchesList = document.querySelector('#recent-searches')


// Betöltjük az oldal betöltésekor a korábbi kereséseket
document.addEventListener('DOMContentLoaded', () => {
    // Kiolvassuk az adatokat a data-searches attribútumból
    const searches = JSON.parse(recentSearchesList.dataset.searches || '[]') // Az index.hbs-ből kapott keresések
    // Frissítjük a keresési listát
    updateRecentSearches(searches) 
})

// messageOne.textContent = 'From JavaScript'

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const location = search.value

    messageOne.textContent = 'Loading...'
    messageTwo.textContent = ''

    fetch('/weather?address=' + location).then((response) => {
        console.log(response)
        // if (!response.ok){
        //     console.log('Network response was not ok' + response.statusText)
        // } else {
            response.json().then((data)=>{
                if (data.error) {
                    messageOne.textContent = data.error
                } else {
                    messageOne.textContent = data.location
                    messageTwo.textContent = data.forecast

                    // Keresési lista frissítése
                    updateRecentSearches(data.searches);
                }
            })
        // }
    })
    // console.log(location)
})

// Keresési lista frissítése a DOM-ban
const updateRecentSearches = (searches) => {
    recentSearchesList.innerHTML = ''; // Töröljük a korábbi listaelemeket

    searches.forEach((searchTerm) => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.textContent = searchTerm;
        link.href = '#'; // Ne töltse újra az oldalt kattintáskor

        link.addEventListener('click', (e) => {
            e.preventDefault() // Az oldal újratöltésének elkerülése

            // Input mező frissítése
            search.value = searchTerm // Az aktuális keresést helyezzük az inputba
            messageOne.textContent = 'Loading...'
            messageTwo.textContent = ''

            // Új keresés indítása
            fetch('/weather?address=' + searchTerm).then((response) => {
                response.json().then((data) => {
                    if (data.error) {
                        messageOne.textContent = data.error;
                    } else {
                        messageOne.textContent = data.location;
                        messageTwo.textContent = data.forecast;
                    }
                });
            });
        });

        listItem.appendChild(link);
        recentSearchesList.appendChild(listItem);
    });
};