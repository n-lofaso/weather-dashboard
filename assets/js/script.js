const APIKey = 'c224881ce9b4aa0549a1a99d4e594f55';
const date = dayjs().format('MM/DD/YYYY');
const fiveDayForcast = $('.five-day-forecast');
const currentWeather = $('.current-weather');
const prevSearches = $('.prev-searches');
const searchHistory = [];

$('.submit-btn').on('click', function (event) {
  event.preventDefault();
  city = $(this).siblings('.cityInput').val().trim();
  if (city == '') {
    return;
  }
  searchHistory.push(city);
  localStorage.setItem('city', JSON.stringify(searchHistory));
  fiveDayForcast.empty();
  getSearchHistory();
  getCurrentWeather();
});

function getCurrentWeather() {
  const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}`;
  currentWeather.empty();
  $.ajax({
    url: queryURL,
    method: 'GET',
  }).then(function (response) {
    const tempEl = $('<p>').text(`Temperature: ${response.main.temp}°F`);
    const windEl = $('<p>').text(`Wind Speed: ${response.wind.speed} mph`);
    const humidityEl = $('<p>').text(`Humidity: ${response.main.humidity}%`);
    $('.cityName').text(response.name + ' - ' + date);
    $('.icon').attr(
      'src',
      `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`
    );
    currentWeather.append(tempEl);
    currentWeather.append(windEl);
    currentWeather.append(humidityEl);
  });
  const fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${APIKey}`;
  $.ajax({
    url: fiveDayURL,
    method: 'GET',
  }).then(function (response) {
    const fiveDayArray = response.list;
    for (let i = 0; i < 50; i = i + 9) {
      const resultDiv = $('<div>');
      resultDiv.attr('class', 'card');
      resultDiv.attr(
        'style',
        'max-width: 300px; margin: 20px 0 20px 30px; background-color: #159895;'
      );

      const resultDivHeader = $('<div>');
      resultDivHeader.attr('class', 'card-header');
      resultDivHeader.attr('style', 'max-width: 300px; padding: 10px; color: #f0f8ff');
      const date = dayjs(`${fiveDayArray[i].dt_txt}`).format('MM/DD/YYYY');
      resultDivHeader.text(date);
      const resultDivBody = $('<div>');
      resultDivBody.attr('class', 'card-header');
      resultDivBody.attr('style', 'max-width: 300px; padding: 10px;');
      const resultDivIcon = $('<img>');
      resultDivIcon.attr(
        'src',
        `https://openweathermap.org/img/wn/${fiveDayArray[i].weather[0].icon}@2x.png`
      );
      resultDivIcon.attr('style', 'height: 75px; width: 75px;');

      const resultTemp = $('<p>').text(
        `Temperature: ${fiveDayArray[i].main.temp}°F`
      );

      const resultWind = $('<p>').text(
        `Wind Speed: ${fiveDayArray[i].wind.speed} mph`
      );

      const resultHumidity = $('<p>').text(
        `Humidity: ${fiveDayArray[i].main.humidity}%`
      );

      fiveDayForcast.append(resultDiv);
      resultDiv.append(resultDivHeader);
      resultDiv.append(resultDivBody);
      resultDivBody.append(resultDivIcon);
      resultDivBody.append(resultTemp);
      resultDivBody.append(resultWind);
      resultDivBody.append(resultHumidity);
    }
  });
}

function getSearchHistory() {
  prevSearches.empty();
  for (let i = 0; i < searchHistory.length; i++) {
    const rowEl = $('<div>');
    const btnEl = $('<button>').text(`${searchHistory[i]}`);
    rowEl.addClass('row');
    btnEl.addClass('btn btn-info prevBtn mt-2');
    prevSearches.prepend(rowEl);
    rowEl.append(btnEl);
  }
  $('.prevBtn').click(function (e) {
    e.preventDefault;
    city = $(this).text();
    currentWeather.empty;
    getCurrentWeather();
    fiveDayForcast.empty();
  });
}

function init() {
  var previousSearchStorage = JSON.parse(localStorage.getItem('city'));
  if (previousSearchStorage !== null) {
    return previousSearchStorage;
  }
  getSearchHistory();
  getCurrentWeather();
}

init();
