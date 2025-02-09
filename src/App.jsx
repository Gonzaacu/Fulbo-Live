import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import "./App.css";
import Player from "./Components/Player.jsx";
import canales from "./data/canales"; // Importamos los datos locales

function App() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargamos los eventos desde los datos locales
    const eventosArray = Object.entries(canales).map(([nombre, enlaces]) => ({
      nombre: nombre, // Usamos el nombre de la clave como nombre del evento
      enlace: enlaces[0], // Tomamos el primer enlace
      imagen: `https://source.unsplash.com/300x200/?soccer`, // Imagen aleatoria de soccer
    }));

    setEventos(eventosArray);
    setLoading(false);
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
                    <Link to={`/player?name=${encodeURIComponent(evento.nombre)}`}>
                      <button className="ver-evento">Ver Evento</button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="sin-eventos">No hay eventos disponibles.</p>
            )}
          </div>
        )}
      </div>
      <Routes>
        <Route path="/" element={<div>Bienvenido a Fulbo Live</div>} />
        <Route path="/player" element={<Player />} />
      </Routes>
    </Router>
  );
}

export default App;
