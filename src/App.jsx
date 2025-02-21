import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Player from "./Components/Player.jsx";
import canales from "./data/canales";
import peliculas from "./data/peliculas";
import series from "./data/series";
import programas from "./data/programas";
import otros from "./data/otros";
import canalesImages from "./data/canalesImages";
import peliculasImages from "./data/peliculasImages";
import seriesImages from "./data/seriesImages";
import programasImages from "./data/programasImages";
import otrosImages from "./data/otrosImages";

function Home() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState("canales");

  const categorias = { canales, peliculas, series, programas, otros };
  const categoriasImages = { 
    canales: canalesImages, 
    peliculas: peliculasImages, 
    series: seriesImages, 
    programas: programasImages, 
    otros: otrosImages 
  };

  useEffect(() => {
    setLoading(true);
    const eventosArray = Object.entries(categorias[categoria] || {}).map(
        ([nombre, data]) => {
            const imagenUrl = categoriasImages[categoria]?.[nombre] || `https://source.unsplash.com/300x200/?${categoria}`;
            
            return {
                nombre,
                enlaces: data.enlaces || [],
                imagen: imagenUrl,
            };
        }
    );

    setEventos(eventosArray);
    setLoading(false);
}, [categoria]);

  return (
    <div className="container">
      <h1 className="titulo">⚽ Fulbo Live</h1>
      
      <nav className="menu">
        <button onClick={() => setCategoria("canales")}>Eventos</button>
        <button onClick={() => setCategoria("peliculas")}>Películas</button>
        <button onClick={() => setCategoria("series")}>Series</button>
        <button onClick={() => setCategoria("programas")}>Programas</button>
        <button onClick={() => setCategoria("otros")}>Otros</button>
      </nav>

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
                  <Link 
                    to={`/player?name=${encodeURIComponent(evento.nombre)}&categoria=${categoria}`}
                  >
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
  );
}

function App() {
  return (
    <Router basename="/Fulbo-Live">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player" element={<Player />} />
      </Routes>
    </Router>
  );
}

export default App;


/*
ultimo que anda

import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Player from "./Components/Player.jsx";
import canales from "./data/canales";
import peliculas from "./data/peliculas";
import series from "./data/series";
import programas from "./data/programas";
import otros from "./data/otros";

function Home() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState("canales");

  const categorias = {
    canales,
    peliculas,
    series,
    programas,
    otros,
  };

  useEffect(() => {
    setLoading(true);
    const eventosArray = Object.entries(categorias[categoria] || {}).map(([nombre, enlaces]) => ({
      nombre: nombre,
      enlace: enlaces[0],
      imagen: `https://source.unsplash.com/300x200/?${categoria}`,
    }));

    setEventos(eventosArray);
    setLoading(false);
  }, [categoria]);

  return (
    <div className="container">
      <h1 className="titulo">⚽ Fulbo Live</h1>
      
      <nav className="menu">
        <button onClick={() => setCategoria("canales")}>Eventos</button>
        <button onClick={() => setCategoria("peliculas")}>Películas</button>
        <button onClick={() => setCategoria("series")}>Series</button>
        <button onClick={() => setCategoria("programas")}>Programas</button>
        <button onClick={() => setCategoria("otros")}>Otros</button>
      </nav>

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
  );
}

function App() {
  return (
    <Router basename="/Fulbo-Live">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player" element={<Player />} />
      </Routes>
    </Router>
  );
}

export default App;


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
// anda
export default App;

*/