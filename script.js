const apiKey = "a5990adb226f4b9ea39162654250912";

document.getElementById("searchBtn").addEventListener("click", getWeather);
document.getElementById("cityInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        getWeather();
    }
});

async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();

    if (!city) {
        alert("Enter city name");
        return;
    }

    try {
        // CURRENT WEATHER
        const weatherURL =
            `https://api.weatherapi.com/v1/current.json?key=a5990adb226f4b9ea39162654250912&q=London&aqi=no`;

        const weatherRes = await fetch(weatherURL);
        const weatherData = await weatherRes.json();

        if (weatherData.cod === "404") {
            document.getElementById("currentWeather").innerHTML = `<h3>City Not Found</h3>`;
            document.getElementById("forecast").innerHTML = "";
            return;
        }

        document.getElementById("currentWeather").innerHTML = `
            <h2>${weatherData.name}</h2>
            <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png">
            <h1>${weatherData.main.temp}°C</h1>
            <p>${weatherData.weather[0].description}</p>
        `;

        // FORECAST
        const forecastURL =
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        const forecastRes = await fetch(forecastURL);
        const forecastData = await forecastRes.json();

        const forecastBox = document.getElementById("forecast");
        forecastBox.innerHTML = "";

        // Filter one forecast per day (12 PM)
        const daily = {};

        forecastData.list.forEach(item => {
            const date = item.dt_txt.split(" ")[0];
            if (!daily[date] && item.dt_txt.includes("12:00:00")) {
                daily[date] = item;
            }
        });

        Object.values(daily).forEach(day => {
            const card = `
                <div class="card">
                    <h4>${new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}</h4>
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
                    <p>${Math.round(day.main.temp)}°C</p>
                    <small>${day.weather[0].description}</small>
                </div>
            `;
            forecastBox.innerHTML += card;
        });

    } catch (error) {
        alert("Network error or invalid API key");
    }
}
