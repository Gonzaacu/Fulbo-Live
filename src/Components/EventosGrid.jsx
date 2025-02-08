import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import "./EventosGrid.css"; // Archivo de estilos
console.log("✅ EventosGrid se está renderizando...");
// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDJsmeXuz4uhSusxIFgmRYlt3O1V-33phc",
  authDomain: "fulbo-streaming.firebaseapp.com",
  projectId: "fulbo-streaming",
  storageBucket: "fulbo-streaming.appspot.com",
  messagingSenderId: "1073325082428",
  appId: "1:1073325082428:web:d931182eaa3148c03f4039",
  measurementId: "G-XVCVR41JES"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function EventosGrid() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    async function obtenerEventos() {
      try {
        const querySnapshot = await getDocs(collection(db, "Canales"));
        const eventosArray = [];

        querySnapshot.forEach((doc) => {
          let data = doc.data();
          console.log("📡 Documento Firestore recibido:", data);

          // Recorremos todos los canales dentro del documento
          Object.entries(data).forEach(([nombreCanal, enlaces]) => {
            eventosArray.push({
              nombre: nombreCanal,
              enlace: enlaces[0], // Tomamos el primer enlace
              imagen: `https://source.unsplash.com/300x200/?sports`, // Imagen aleatoria de deportes
            });
          });
        });

        console.log("🎯 Eventos cargados en el estado:", eventosArray);
        setEventos(eventosArray);
      } catch (error) {
        console.error("❌ Error al obtener eventos:", error);
      }
    }

    obtenerEventos();
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
