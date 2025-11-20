async function getWeather() {
    const city = document.getElementById("cityInput").value || "London";

    const url = `http://api.weatherapi.com/v1/current.json?key=81373e1030674b44909113018252011&q=London&aqi=yes`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // ========== CURRENT WEATHER ========== //
        document.getElementById("cityName").innerText =
            `${data.location.name}, ${data.location.country}`;
        document.getElementById("temp").innerText = data.current.temp_c + "°C";
        document.getElementById("condition").innerText = data.current.condition.text;
        document.getElementById("aqi").innerText = "AQI: " + data.current.air_quality.pm2_5;
        document.getElementById("weatherIcon").src =
            "https:" + data.current.condition.icon;

        document.getElementById("weatherCard").style.display = "block";

        // ========== WEATHER BACKGROUND ========== //
        const condition = data.current.condition.text.toLowerCase();

        document.body.className = "default-bg";
        document.getElementById("rainAnim").style.display = "none";
        document.getElementById("sunAnim").style.display = "none";

        if (condition.includes("sun") || condition.includes("clear")) {
            document.body.className = "sunny";
            document.getElementById("sunAnim").style.display = "block";
        }
        else if (condition.includes("cloud")) {
            document.body.className = "cloudy";
        }
        else if (condition.includes("rain") || condition.includes("drizzle")) {
            document.body.className = "rainy";
            document.getElementById("rainAnim").style.display = "block";
        }
        else if (condition.includes("snow")) {
            document.body.className = "snow";
        }

        // ========== 5-DAY FORECAST ========== //
        document.getElementById("forecastTitle").innerText = "5-Day Forecast";
        document.getElementById("forecastTitle").style.display = "block";

        const forecastBox = document.getElementById("forecastBox");
        forecastBox.innerHTML = "";
        forecastBox.style.display = "grid";

        data.forecast.forecastday.forEach(day => {
            const item = `
                <div class="forecast-item">
                    <h4>${day.date}</h4>
                    <img src="https:${day.day.condition.icon}">
                    <p>${day.day.avgtemp_c}°C</p>
                    <p>${day.day.condition.text}</p>
                </div>
            `;
            forecastBox.innerHTML += item;
        });

    } catch (error) {
        alert("City not found or API error!");
    }
}
