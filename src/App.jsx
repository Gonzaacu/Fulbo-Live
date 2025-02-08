import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs } from "firebase/firestore";
import './App.css';

function App() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    async function obtenerEventos() {
      const querySnapshot = await getDocs(collection(db, "canales"));
      let eventosArray = [];

      querySnapshot.forEach(doc => {
        let data = doc.data();
        let nombreCanal = Object.keys(data)[0];  // Nombre del canal
        let enlaces = data[nombreCanal];  // Array de enlaces

        eventosArray.push({
          nombre: nombreCanal,
          enlace: enlaces[0]  // Primer enlace
        });
      });

      setEventos(eventosArray);
    }

    obtenerEventos();
  }, []);

  return (
    <div>
      <h1>Fulbo Live</h1>
      <ul>
        {eventos.length > 0 ? (
          eventos.map((evento, index) => (
            <li key={index}>
              <a href={`player.html?link=${evento.enlace}`} target="_blank">
                {evento.nombre}
              </a>
            </li>
          ))
        ) : (
          <p>Cargando eventos...</p>
        )}
      </ul>
    </div>
  );
}

export default App;
