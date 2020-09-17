const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');

const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');

fetch('http://api.openweathermap.org/data/2.5/weather?q=Stockholm,Sweden&units=metric&APPID=3f1c95b540a45d2a48ff596267d9d939')
  .then((response) => {
    return response.json();
  })

  .then((json) => {
    cityName.innerText = `City: ${json.name}`;
    temperature.innerText = `Temperature: ${Math.floor(json.main.temp)}`;
    description.innerText = `Description: ${json.weather[0].description}`;

    const sunriseValue = json.sys.sunrise; //Sunrise and Sunset times in UNIX
    const sunsetValue = json.sys.sunset;

    /* Multiply by 1000 because the data is given to us in UNIX which is in seconds, but Javascript uses milliseconds internally, this way we get the right date. */
    const sun = new Date(sunriseValue * 1000);
    const set = new Date(sunsetValue * 1000);

    /* From the Date format we got above from sun and set, extract only the hours and minutes - using slice method on the minutes part so that it shows the 0 when minutes are less than 10, otherwise it will show 19:2 instead of 19:02. Got this from StackO: https://stackoverflow.com/questions/8935414/getminutes-0-9-how-to-display-two-digit-numbers */
    sunrise.innerText = `Sunrise: ${sun.getHours()}:${('0'+ sun.getMinutes()).slice(-2)}`;
    sunset.innerText = `Sunset: ${set.getHours()}:${('0'+ set.getMinutes()).slice(-2)}`;
  })

  .catch((error) => {
    console.log(error);
  });

  // New Fetch for the 5 days Forecast
  const day1 = document.getElementById('day1');

  fetch('https://api.openweathermap.org/data/2.5/forecast?q=Stockholm,Sweden&units=metric&APPID=3f1c95b540a45d2a48ff596267d9d939')
  .then((response) => {
    return response.json();
  })

  .then ((json) => {
    //Filters out forecast at 12:00 for coming 5 days
    const filteredForecast = json.list.filter(item => item.dt_txt.includes('12:00'));

    console.log(filteredForecast);
    
    const unixDay1 = filteredForecast[0].dt;
    const unixDay1ToMili = new Date(unixDay1 * 1000);

    let weekday = unixDay1ToMili.getDay();
    switch (weekday) {
      case 0:
        weekday = "Sunday";
        break;
      case 1:
        weekday = "Monday";
        break;
      case 2:
        weekday = "Tuesday";
        break;
      case 3:
        weekday = "Wednesday";
        break;
      case 4:
        weekday = "Thursday";
        break;
      case 5:
        weekday = "Friday";
        break;
      case  6:
        weekday = "Saturday";
    };

    const minTemp = Math.floor(filteredForecast[0].main.temp_min);
    const maxTemp = Math.floor(filteredForecast[0].main.temp_max);

    let day1 = document.getElementById('day1');
    day1.innerText = `${weekday} | Min Temp: ${minTemp} | Max Temp: ${maxTemp}`;
  })

  .catch((error) => {
    console.log(error);
  });