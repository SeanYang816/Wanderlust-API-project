// Foursquare API Info
const client_id = 'HEND1QDN2KZUZBDJ33IYOA4LSRKFF0D0FALU3OBB0SDH0ISN';
const client_secret = 'TJVX0WFABIQLJOGDLQA0LFYDOXYG4CQICM4NAHCYYU55SLXI';
const url = 'https://api.foursquare.com/v2/venues/explore';

// OpenWeather Info
const openWeatherKey = '91b82a310cd3a5b625b136333b7a58c4';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4")];
const $weatherDiv = $("#weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('');
};


// Add AJAX functions here:
const getVenues = async () => {
  const city =  $input.val();
  const date = new Date();
  const limit = 20;
  const urlToFetch = `${url}?near=${city}&limit=${limit}&client_id=${client_id}&client_secret=${client_secret}&v=${date.yyyymmdd()}`

  try{
    const response = await fetch(urlToFetch);
    if(response.ok){
      console.log(response)
      const jsonResponse = await response.json();
      console.log(jsonResponse);
      const venues = jsonResponse.response.groups[0].items.map( item => item.venue )
      return venues
    }
  }
  catch(error){
    console.log(error)
  }

} // ---end

const getForecast = async () => {
  try{
    const urlToShorten = `${weatherUrl}?&q=${$input.val()}&appid=${openWeatherKey}`
    const response = await fetch(urlToShorten);
    const jsonResponse = response.json();
    console.log(jsonResponse)
    return jsonResponse;
  }
  catch(error){
    console.log(error)
  }
}


// Render functions
const renderVenues = (venues) => {
  let i = 0;
  while ( i < 0){
    
  }
  $venueDivs.forEach(($venue, index) => {
    const venue = venues[index];
    const venueIcon = venue.categories[0].icon;
    const venueImgSrc = `${venueIcon.prefix}bg_64${venueIcon.suffix}`;
    let venueContent = createVenueHTML(venue.name, venue.location, venueImgSrc);
    $venue.append(venueContent);
  });
  $destination.append(`<h2>${venues[0].location.city}</h2>`);
}

const renderForecast = (day) => {
  // Add your code here:
  
	let weatherContent = createWeatherHTML(day);
  $weatherDiv.append(weatherContent);
}

const executeSearch = () => {
  $venueDivs.forEach(venue => venue.empty());
  $weatherDiv.empty();
  $destination.empty();
  $container.css("visibility", "visible");
  getVenues()
  .then(venues => renderVenues(venues));
  getForecast()
  .then(forecast => renderForecast(forecast))
  return false;
}

$submit.click(executeSearch)