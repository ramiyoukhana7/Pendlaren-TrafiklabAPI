import { useState } from 'react';
import './App.css';

function App() {
    const [message, setMessage] = useState('');
    const [stops, setStops] = useState([]);
    const [selectedStop, setSelectedStop] = useState(null);
    const [departures, setDepartures] = useState([]);
    const API_KEY = '8dfaea32-97af-469d-bd36-7aec7bdac733'; 
  
    const [fromStation, setFromStation] = useState('');
    const [toStation, setToStation] = useState('');

    function getPosition() {
        if('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                console.log('Position is: ', position);
                const coords = position.coords;
                console.log('coords: ', coords);
                console.log('timestamp: ', position.timestamp);
                setMessage(`Your position is: ${coords.latitude} latitude, ${coords.longitude} longitude.`);

                getLocals(coords);
            });
        }
    }

    function getLocals(coords) {
        fetch(`https://api.resrobot.se/v2.1/location.nearbystops?originCoordLat=${coords.latitude}&originCoordLong=${coords.longitude}&format=json&accessId=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const stopsList = data.stopLocationOrCoordLocation.map(item => item.StopLocation);
                setStops(stopsList);
              })
            }

    function getDepartures(extId) {
      fetch(`https://api.resrobot.se/v2.1/departureBoard?id=${extId}&format=json&accessId=${API_KEY}`)
          .then(response => response.json())
          .then(data => {
              console.log(data);
              setDepartures(data.Departure);
                });
              }

    function handleStopSelection(stop) {
                setSelectedStop(stop);
                getDepartures(stop.extId);
            }
    
    function planTrip() {
        fetch(`https://api.resrobot.se/v2.1/location.name?input=${fromStation}&format=json&accessId=${API_KEY}`)
          .then(response => response.json())
          .then(data => {
            console.log(data);
          })
    }
  
    return (
      <div>
          <header>
              <h1>Geolocation</h1>
          </header>
          <main>
              <button onClick={getPosition}>See location</button>
              <p>{message}</p>
              <ul>
                  {stops.map(stop => (
                      <li key={stop.extId}>
                          <button onClick={() => handleStopSelection(stop)}>{stop.name}</button>
                      </li>
                  ))}
              </ul>
              {selectedStop ? <p>Selected Stop: {selectedStop.name}</p> : <p>Select a stop from the list above.</p>}

              <h2>Departures:</h2>
              <ul>
                  {departures.map(departure => (
                      <li key={departure.id}>{departure.name} at {departure.time}</li>
                  ))}
              </ul>
            <label>
                  from:
                  <input 
                    type='text'
                    value={fromStation}
                    onChange = {(e) => setFromStation(e.target.value)}
                    placeholder='Enter starting station'
                  />
            </label>
            <label>
                  to:
                  <input 
                    type='text'
                    value={toStation}
                    onChange = {(e) => setToStation(e.target.value)}
                    placeholder='Enter destination station'
                  />
            </label>
            <button onClick={planTrip}>Plan Trip</button>
          </main>
      </div>
  );
}

export default App;