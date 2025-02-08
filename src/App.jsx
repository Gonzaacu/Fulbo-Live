import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import "./App.css";

function App() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function obtenerEventos() {
      try {
        console.log("📡 Consultando Firestore...");

        const querySnapshot = await getDocs(collection(db, "Canales")); 
        let eventosArray = [];

        querySnapshot.forEach((doc) => {
  let data = doc.data();
  console.log("📄 Documento en Firestore:", data);

  Object.keys(data).forEach((nombreCanal) => {
    let enlaces = data[nombreCanal];

    try {
      if (typeof enlaces === "string") {
        enlaces = JSON.parse(enlaces); // 🔥 Convertir string en array
      }

      if (Array.isArray(enlaces) && enlaces.length > 0) {
        eventosArray.push({
          nombre: nombreCanal,
          enlace: enlaces[0].trim(),
          imagen: `https://source.unsplash.com/300x200/?soccer`,
        });
      }
    } catch (error) {
      console.error(`❌ Error procesando los enlaces de ${nombreCanal}:`, error);
    }
  });
});


        setEventos(eventosArray);
      } catch (error) {
        console.error("❌ Error al obtener eventos:", error);
      } finally {
        setLoading(false);
      }
    }

    obtenerEventos();
  }, []);

  return (
    <Router basename="/Fulbo-Live">
      <div className="container">
        <h1 className="titulo">⚽ Fulbo Live</h1>

        {loading ? (
          <p className="cargando">Cargando eventos...</p>
        ) : (
          <div className="eventos-grid">
            {eventos.length > 0 ? (
              eventos.map((evento, index) => (
                <div key={index} className="evento-card">
                  <img src={evento.imagen} alt={evento.nombre} className="evento-img" />
                  <div className="evento-info">
                    <h3>{evento.nombre}</h3>
                    <a href={`/player.html?link=${encodeURIComponent(evento.enlace)}`} target="_blank" rel="noopener noreferrer">
                      <button className="ver-evento">Ver Evento</button>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="sin-eventos">No hay eventos disponibles.</p>
            )}
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
