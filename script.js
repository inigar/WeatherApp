const apiKey = "a5990adb226f4b9ea39162654250912";

document.getElementById("searchBtn").addEventListener("click", getWeather);
document.getElementById("cityInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") getWeather();
});

async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();

    if (!city) {
        alert("Enter city name");
        return;
    }

    try {
        // WeatherAPI forecast (3 days)
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&aqi=no&alerts=no`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
            document.getElementById("currentWeather").innerHTML = `<h3>City Not Found</h3>`;
            document.getElementById("forecast").innerHTML = "";
            return;
        }

        // CURRENT WEATHER
        document.getElementById("currentWeather").innerHTML = `
            <h2>${data.location.name}</h2>
            <img src="${data.current.condition.icon}">
            <h1>${data.current.temp_c}°C</h1>
            <p>${data.current.condition.text}</p>
        `;

        // FORECAST (3 days)
        const forecastBox = document.getElementById("forecast");
        forecastBox.innerHTML = "";

        data.forecast.forecastday.forEach(day => {
            const card = `
                <div class="card">
                    <h4>${day.date}</h4>
                    <img src="${day.day.condition.icon}">
                    <p>${Math.round(day.day.avgtemp_c)}°C</p>
                    <small>${day.day.condition.text}</small>
                </div>
            `;
            forecastBox.innerHTML += card;
        });

    } catch (error) {
        alert("Network error — check API key");
    }
}
