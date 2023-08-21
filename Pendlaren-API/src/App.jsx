import { useState } from 'react';
import './App.css';

function App() {
    const [message, setMessage] = useState('');
    const [stops, setStops] = useState([]);
    const [selectedStop, setSelectedStop] = useState(null);
    const [departures, setDepartures] = useState([]);

    function getPosition() {
        console.log('getPosition 1');
        if('geolocation' in navigator) {
            console.log('getPosition 2');    
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
        fetch(`https://api.resrobot.se/v2.1/location.nearbystops?originCoordLat=${coords.latitude}&originCoordLong=${coords.longitude}&format=json&accessId=8dfaea32-97af-469d-bd36-7aec7bdac733`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const stopsList = data.stopLocationOrCoordLocation.map(item => item.StopLocation);
                setStops(stopsList);
              })
            }

    function handleStopSelection(stop) {
        setSelectedStop(stop);
        getDepartures(stop.extId);

    }
    function getDepartures(extId) {
      const API_KEY = '8dfaea32-97af-469d-bd36-7aec7bdac733'; // din API-nyckel
      fetch(`https://api.resrobot.se/v2.1/departureBoard?id=${extId}&format=json&accessId=${API_KEY}`)
          .then(response => response.json())
          .then(data => {
              console.log(data);
              setDepartures(data.Departure || []); // Antar att "Departure" är nyckeln i svaret för avgångsdata. Ändra om det behövs.
                });
              }
  
              return (
                <div>
                    <header>
                        <h1> Geolocation </h1>
                    </header>
                    <main>
                        <button onClick={getPosition}> See location </button>
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
                                <li key={departure.id}>{departure.name} at {departure.time}</li> // Ändra 'name' och 'time' baserat på den faktiska strukturen av svaret.
                            ))}
                        </ul>
                    </main>
                </div>
            );
            }
            
            export default App;