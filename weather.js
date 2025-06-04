const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");

const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");

const userInfoContainer = document.querySelector(".user-info-container");


//----------------------------------------------------------------------------------------------------

const API_KEY ="4c9879ef9fa412505f7686fa12b89601";

let currentTab = userTab;
currentTab.classList.add("container-tab");
getfromSessionStorage();

function renderWeather(weatherInfo)
{
    //firstly, we have fetch the elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from weatherInfo objects and put it in UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

async function fetchUserWeatherInfo(coordinates)
{
    const {lat,lon} = coordinates;

    // console.log("Latitude:", lat, "Longitude:", lon);
    //step1: make grant container invisible
    grantAccessContainer.classList.remove("active");
    //step2:make loader visible
    loadingScreen.classList.add("active");

    //API Call
    try{
        console.log(`Fetching: https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeather(data);
    }
    catch(err)
    {
        loadingScreen.classList.remove("active");
        alert("Failed to fetch weather data. Please check city name or try again later.");
    }
}

function getfromSessionStorage()
{
    //check if coordinates are already present in session storage

    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates)
    {
        //if local coordinates are not present/available
        grantAccessContainer.classList.add("active");
    }
    else{
        //if local coordinates are available/present
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

function switchTab(clickedTab)
{
    if(clickedTab!=currentTab)
    {
        //------switching the bg-color on clicking the buttons------//
        //step1: remove bg-color of the button 
        currentTab.classList.remove("container-tab");
        //step2:make clicked tab(button) as current tab(button)
        currentTab=clickedTab;
        //step3: now make the new current tab(button) bg-color white.i.e add bg-color
        currentTab.classList.add("container-tab");

        //
        //step1:this cond means search form container is not visible to us at this moment.it is inactive then go into if cond
        if(!searchForm.classList.contains("active"))
        {
            //step2:hide the user info container
            userInfoContainer.classList.remove("active");
            //step3:hide the grant location access container.this is the container which opens when we open the website 
            grantAccessContainer.classList.remove("active");
            //step4: active the search container. 
            searchForm.classList.add("active");
        }
        else{
            //we are already in the search tab and we want to active/make visible the weather tab i.e. user info container
            //step1:hide/remove the search container
            searchForm.classList.remove("active");
            //step2:hide/remove the user info container
            userInfoContainer.classList.remove("active");
            //step3:now we are in your(user) weather tab, so weather need also to be displayed .so lets check local storage first for coordinates, if we haved saved them there.
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click",() => {
    //pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click",() => {
    //pass clicked tab as input parameter
    switchTab(searchTab);
});



function showPosition(position)
{
    const userCoordinates = {
        lat: position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates)
}

function getLocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Geolocation is not supported by your browser.");
    }
}

const grantAccessBtn = document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener("click", getLocation);



const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName === "")
        return;
    else
        fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeather(data);
    }
    catch(err)
    {
        //hw
    }
}

