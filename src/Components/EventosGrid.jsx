import { useEffect, useState } from "react";
import canales from "../data/canales"; // Importamos los datos
import "./EventosGrid.css"; // Archivo de estilos

console.log("✅ EventosGrid se está renderizando...");

export default function EventosGrid() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const eventosArray = Object.entries(canales).map(([nombre, enlaces]) => ({
      nombre: nombre, // Usamos el nombre de la clave como nombre del evento
      enlace: enlaces[0], // Tomamos el primer enlace
      imagen: `https://source.unsplash.com/300x200/?sports`, // Imagen aleatoria
    }));

    console.log("🎯 Eventos cargados en el estado:", eventosArray);
    setEventos(eventosArray);
  }, []);

  return (
    <div className="eventos-grid">
      {eventos.length === 0 ? (
        <p>📡 Cargando eventos...</p>
      ) : (
        eventos.map((evento, index) => (
          <div key={index} className="evento-card">
            <img src={evento.imagen} alt={evento.nombre} className="evento-img" />
            <div className="evento-info">
              <h3>{evento.nombre}</h3>
              <a href={evento.enlace} target="_blank" rel="noopener noreferrer">
                <button className="ver-evento">Ver Evento</button>
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
