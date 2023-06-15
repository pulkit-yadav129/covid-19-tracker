
import './App.css';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://covid-193.p.rapidapi.com/statistics';

const App = () => {
  let arr=[];
  const [continents, setContinents] = useState([]);
  const [searchCountry, setSearchCountry] = useState([]);
  const [selectedContinent, setSelectedContinent] = useState(null);

  useEffect(() => {
    const fetchContinentsData = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            'X-RapidAPI-Key': '20c90a6388mshdfe3f5fbb6d820dp1eb475jsn7b43c06796df',
            'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
          }
        });
        const data = response.data.response;
        //console.log(data[0]);
        const obj={};
        data.map(e=>{
          if(e.continent){

            // console.log(e);
            // console.log(e.continent);
            let ob={};
            ob={name:e.country,continent:e.continent, cases:e.cases.total,population:e.population}
            if(obj[e.continent]){
              //console.log(e.cases.total);
              
              obj[e.continent].push(ob)
            }
            else
              obj[e.continent]=[ob]
          }
        })
        //console.log(obj);
        arr=Object.keys(obj).map((key)=>obj[key]);
        
        console.log(arr[0][0].continent);
        const continentsData = Object.keys(data).map((continent) => ({
          name: continent,
          countries: [data[continent]],
        }));
        //console.log(continentsData[0]);

        setContinents(arr);
        console.log(arr);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchContinentsData();
  }, []);

  const fetchCountry = async(country)=>{
    try{
      console.log('hello');
      const url = API_URL+ '?country=' + country
      const response = await axios.get(url, {
        headers: {
          'X-RapidAPI-Key': '20c90a6388mshdfe3f5fbb6d820dp1eb475jsn7b43c06796df',
          'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
        }
      });
      const data = response.data.response;
      console.log(data);
      if(data.length>0)
      setSearchCountry(data);
      
    }
    catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleSearchChange = (event) => {
    const country =event.target.value;
    fetchCountry(country);
    
  };

  const handleContinentClick = (continent) => {
    setSelectedContinent(continent === selectedContinent ? null : continent);
  };

  const getCountryDetails = (country) => {
    const { name ,population, cases } = country;
    const totalCases = cases.total || 0;

    return (
      <tr key={country.country}>
        <td>{name}</td>
        <td>{population}</td>
        <td>{cases}</td>
      </tr>
    );
  };

  const renderContinent = (continent) => {
    // const country = continent[i].name;
    const isExpanded = continent === selectedContinent;
    const continentSymbol = isExpanded ? '-' : '+';

    return (
      <div key={continent.name} className="continent">
        <button className="expand-button" onClick={() => handleContinentClick(continent)}>
          {continentSymbol}
        </button>
        
        
        <h3>{continent[0].continent}</h3>
        {isExpanded && (
          <table>
            <thead>
              <tr>
                <th>Country</th>
                <th>Population</th>
                <th>Total Cases</th>
              </tr>
            </thead>
            <tbody>
              {continent && continent.map(getCountryDetails)}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  

  return (
    <div className="App">
      <h1>COVID-19 Tracker</h1>
      <input
        type="text"
        placeholder="Search by country"
        // value={searchCountry}
        onChange={handleSearchChange}
      />
      {searchCountry.length>0  ? (
        <div>
        <table>
            <thead>
              <tr>
                <th>Country</th>
                <th>Population</th>
                <th>Total Cases</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{searchCountry[0].country}</td>
                <td>{searchCountry[0].population}</td>
                <td>{searchCountry[0].cases.total}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
      ) : (
        continents.map(renderContinent)
      )}
    </div>
  );
};

export default App;