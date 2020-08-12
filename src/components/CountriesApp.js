import React, { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = process.env.REACT_APP_API_KEY

const CountriesApp = () => {

  const [countries, setCountries] = useState([])

  const [filterBy, setFilterBy] = useState('')

  const hook = () => {

    axios
      .get('http://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })

  }
  useEffect(hook, [])

  const handleChange = (event) => {
    setFilterBy(event.target.value)
  }

  return (

    <div>

      find countries
      <input
        value={filterBy}
        onChange={handleChange}
      />
      <Countries countries={countries} filterBy={filterBy} />


    </div>

  )

}

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState({ weather: {}, main: {} })
  const [desc, setDesc] = useState([])
  const [loading, setLoading] = useState(true)
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${capital}&units=imperial&appid=${api_key}`

  useEffect(() => {

    axios
      .get(url)
      .then(response => {
        setLoading(false)

        setWeather(response.data)
        setDesc(response.data.weather[0])

      })
  }, [url])

  return loading ? <p>loading...</p> : (
    <div>
      <h2>Weather in {capital}</h2>
      <p>Temperature is {weather.main.temp}°F </p>
      <p>The current weather is {desc.description}</p>
      <img src={`http://openweathermap.org/img/wn/${desc.icon}@2x.png`} alt={'weather icon'} width="100" height="auto" />
    </div>
  )

}


const Country = ({ country }) => {

  return (
    <>

      <h1>{country.name}</h1>

      <p>capital {country.capital}</p>
      <p>population {country.population}</p>

      <h2>Languages</h2>
      <ul>
        {country.languages
          .map((lang) =>
            <li key={lang.iso639_1}>{lang.name}</li>
          )}
      </ul>
      {console.log(country.flag)}
      <img src={country.flag} alt={`flag of ${country.name}`} width="300" height="auto" />
      <Weather capital={country.capital} />


    </>
  )
}



const ListCountry = ({ country }) => {

  const [showDetails, setShowDetails] = useState(false)

  if (showDetails) {
    return (

      <div>
        {country.name}
        <button onClick={() => setShowDetails(false)}>Hide</button>
        <Country country={country} />
      </div>

    )
  }
  else return (
    <div >
      {country.name}
      <button onClick={() => setShowDetails(true)}>Show</button>


    </div>
  )


}

const Countries = ({ countries, filterBy }) => {

  let filtered = countries.filter(country => country.name.toLowerCase().includes(
    filterBy.toLowerCase()))

  let size = Object.keys(filtered).length

  if (size > 10) return <div>Too many matches, specify another filter</div>

  else if (size > 1) return (
    <div>
      {filtered
        .map((country) =>

          <ListCountry key={country.name} country={country} />

        )}
    </div>
  )
  else if (size === 1)

    return (

      <div>

        <Country country={filtered[0]} />
      </div>
    )
  else return (
    <div></div>
  )
}

export default CountriesApp