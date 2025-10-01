# OpenWeather API

**GITHUB:** https://github.com/doalef/openweather-api

**LIVE VERSION:** https://weatherapi.liara.run/

**API DOCUMENTAION:** https://weatherapi.liara.run/api-docs

## Quick Deployment:
First, make sure you have Docker and Docker Compose installed, then, create a `.env` file using `.env.sample` as reference. (please match the env variables with docker compose variables to ensure a smooth project boot up).
After creating the `.env` file you can run:

    docker-compose up --build

## Adding The First Record
Call `/api/auth/register` with the following payload:

    {
	    "name": "John Doe",
	    "email": "john@email.com",
	    "password": "~44N76=NpmrV"
    }
You should expect a response similiar to this:

    {
    "success": true,
    "data": {
        "user": {
            "id": "74999dea-9fca-42ba-ba8c-9ec91dff0ee6",
            "name": "name",
            "email": "hadi@gmail.cum"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3NDk5OWRlYS05ZmNhLTQyYmEtYmE4Yy05ZWM5MWRmZjBlZTYiLCJlbWFpbCI6ImhhZGlAZ21haWwuY3VtIiwiaWF0IjoxNzU5Mjg5NzQ4LCJleHAiOjE3NTkyOTMzNDh9.lsqZKmLFmuW2eSrz0nZAiGw4lmBvf6KoMIoAvs-0CHs",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3NDk5OWRlYS05ZmNhLTQyYmEtYmE4Yy05ZWM5MWRmZjBlZTYiLCJlbWFpbCI6ImhhZGlAZ21haWwuY3VtIiwiaWF0IjoxNzU5Mjg5NzQ4LCJleHAiOjE3NTk4OTQ1NDh9.DHzR2jnmr85Kg6CPkLEEOw-pyGeWeTKb770QZloVENA",
        "expiresIn": 1759293348
    }
We need the `token` to create our first weather record since it's a protected endpoint.
next, call `/api/weather`, make sure to set a request header for authorization before calling the api  `Authorization: Bearer your-token`
this api takes a cityName and country as it's payload and fetched the current weather from OpenWeather and stores it in the database;
`{ "cityName": "London", "country": "Gb" }`

since the OpenWeather's current weather api does not work with city and country names, the server separatly calls the geocoding API and turns the city and country names into coordinates and uses them to fetch the current weather.
the api also **caches** the coordinates coresponding to the city and country name to limit the external api calls and prevent rate limits.
The response of the api:

    {
	    "success": true,
	    "data": {
	        "weatherData": {
	            "id": "8807e2c9-ecf5-4154-baaa-d8e690049c32",
	            "cityName": "London",
	            "country": "GB",
	            "lat": 51.5072,
	            "lon": -0.1276,
	            "main": "Clouds",
	            "description": "broken clouds",
	            "temperature": 10,
	            "feelsLike": 10,
	            "minTemperature": 9,
	            "maxTemperature": 12,
	            "pressure": 1027,
	            "humidity": 89,
	            "windSpeed": 1.03,
	            "windDirection": 0,
	            "clouds": 84,
	            "fetchedAt": "2025-10-01T03:47:58.781Z",
	            "createdAt": "2025-10-01T03:47:58.784Z",
	            "updatedAt": "2025-10-01T03:47:58.784Z"
	        }
	    },
	    "message": "Weather data added successfuly"
    }

The weather object will also be cached for a while to prevent redundant data being store, since current weather data does not update really frequently anyways.

You can checkout when the caching system comes into play by observing the application logs, the application logs every time a cache eviction, cache hit, or cache miss occurs.

You can find out more about each API by going through the [API Documentation.](https://weatherapi.liara.run/api-docs) 

### Development
Create a `.env` file for development, then run the following commands:
`npm run watch`
then:
`npm run dev`