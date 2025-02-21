import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Hls from "hls.js";
import canales from "../data/canales";
import peliculas from "../data/peliculas";
import series from "../data/series";
import programas from "../data/programas";
import otros from "../data/otros";
import canalesImages from "../data/canalesImages"; // Importar imágenes de canales
import otrosImages from "../data/otrosImages"; // Importar imágenes de otros
import peliculasImages from "../data/peliculasImages"; // Importar imágenes de películas
import programasImages from "../data/programasImages"; // Importar imágenes de programas
import seriesImages from "../data/seriesImages"; // Importar imágenes de series

const categorias = {
  canales,
  peliculas,
  series,
  programas,
  otros,
};

const categoriasImages = {
  canales: canalesImages,
  peliculas: peliculasImages,
  series: seriesImages,
  programas: programasImages,
  otros: otrosImages,
};

const Player = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [videoLinks, setVideoLinks] = useState([]);
  const [currentLink, setCurrentLink] = useState("");
  const [canalName, setCanalName] = useState("");
  const [categoria, setCategoria] = useState(localStorage.getItem("categoria") || "canales");
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const nameParam = queryParams.get("name");
    const categoriaParam = queryParams.get("categoria");

    if (categoriaParam) {
      setCategoria(categoriaParam);
      localStorage.setItem("categoria", categoriaParam);
    }

    if (nameParam) {
      setCanalName(nameParam);
      const evento = categorias[categoriaParam]?.[nameParam];

      if (evento && Array.isArray(evento) && evento.length > 0) {
        setVideoLinks(evento);
        setCurrentLink(evento[0]);
      } else {
        console.error("⚠️ Error: Evento no encontrado o sin enlaces.");
        setVideoLinks([]); // Limpiar enlaces
        setCurrentLink(""); // Limpiar enlace actual
      }
    }
  }, [location]);

  useEffect(() => {
    if (!currentLink || !videoRef.current) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    if (currentLink.includes(".m3u8") && Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(currentLink);
      hls.attachMedia(videoRef.current);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play();
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("❌ Error en HLS:", data);
      });
    } else if (currentLink.includes(".m3u8")) {
      videoRef.current.src = currentLink;
      videoRef.current.addEventListener("loadedmetadata", () => {
        videoRef.current.play();
      });
    }
  }, [currentLink]);

  const handleLinkClick = (link) => {
    setCurrentLink(link);
  };

  const handleCategoriaClick = (categoria) => {
    navigate(`/?categoria=${categoria}`);
  };

  // Obtener todos los canales de la categoría seleccionada
  const categoriaSeleccionada = categorias[categoria] || {};
  const otrosCanales = Object.keys(categoriaSeleccionada).filter(key => key !== canalName);

  const handleCanalSeleccionado = (canal) => {
    setCanalName(canal);
    const evento = categoriaSeleccionada[canal];

    if (evento && Array.isArray(evento) && evento.length > 0) {
      setVideoLinks(evento);
      setCurrentLink(evento[0]); // Reproducir el primer enlace
    } else {
      console.error("⚠️ Error: Evento no encontrado o sin enlaces.");
    }
  };

  // Obtener la imagen del canal desde el archivo de imágenes correspondiente
  const getCanalImage = (canal) => {
    // Obtener el objeto de imágenes según la categoría
    const imagenesCategoria = categoriasImages[categoria];
    return imagenesCategoria[canal] || ""; // Retorna la URL de la imagen si existe
  };

  return (
    <div>
      <h1 className="titulo">
        <a href="/">⚽ Fulbo Live</a>
      </h1>

      {/* Menú de categorías */}
      <nav className="menu">
        <button onClick={() => handleCategoriaClick("canales")}>Eventos</button>
        <button onClick={() => handleCategoriaClick("peliculas")}>Películas</button>
        <button onClick={() => handleCategoriaClick("series")}>Series</button>
        <button onClick={() => handleCategoriaClick("programas")}>Programas</button>
        <button onClick={() => handleCategoriaClick("otros")}>Otros</button>
      </nav>

      {canalName && (
        <div className="canal-info">
          <h2>
            {canalName} 
            {getCanalImage(canalName) && (
              <img 
                src={getCanalImage(canalName)} 
                alt={canalName} 
                width="80" 
                height="70" 
              />
            )}
          </h2>
        </div>
      )}

      {videoLinks.length > 0 ? (
        <>
          {currentLink.includes(".m3u8") ? (
            <video ref={videoRef} controls width="800" height="450"></video>
          ) : (
            <iframe
              src={currentLink}
              width="800"
              height="450"
              allowFullScreen
              allow="encrypted-media"
              title={canalName}
            ></iframe>
          )}
          <div>
            {videoLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => handleLinkClick(link)}
                disabled={link === currentLink}
              >
                {`Opción ${index + 1}`}
              </button>
            ))}
          </div>

          {/* Mostrar los demás canales de la categoría seleccionada en 3 columnas */}
          <h3>Otros canales de {categoria}:</h3>
          <div className="canales-grid">
            {otrosCanales.map((canal, index) => (
              <button key={index} onClick={() => handleCanalSeleccionado(canal)} className="canal-button">
                {canal}
              </button>
            ))}
            <h3>Bienvenido a Tv Live</h3>
          </div>
        </>
      ) : (
        <h2>⚠️ Error: No hay enlaces disponibles</h2>
      )}
    </div>
  );
};

export default Player;




/*
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Hls from "hls.js";
import canales from "../data/canales";

const Player = () => {
  const location = useLocation();
  const [videoLinks, setVideoLinks] = useState([]);
  const [currentLink, setCurrentLink] = useState("");
  const [canalName, setCanalName] = useState("");
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const nameParam = queryParams.get("name");

    if (nameParam) {
      setCanalName(nameParam);

      const canalSeleccionado = Object.entries(canales).find(
        ([nombre]) => nombre === nameParam
      );

      if (canalSeleccionado) {
        const [, enlaces] = canalSeleccionado;
        setVideoLinks(enlaces);
        setCurrentLink(enlaces[0]);
      } else {
        console.error("⚠️ Error: Canal no encontrado.");
      }
    }
  }, [location]);

  useEffect(() => {
    if (!currentLink || !videoRef.current) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    if (currentLink.includes(".m3u8") && Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(currentLink);
      hls.attachMedia(videoRef.current);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play();
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("❌ Error en HLS:", data);
      });
    } else if (currentLink.includes(".m3u8")) {
      videoRef.current.src = currentLink;
      videoRef.current.addEventListener("loadedmetadata", () => {
        videoRef.current.play();
      });
    }
  }, [currentLink]);

  const handleLinkClick = (link) => {
    setCurrentLink(link);
  };

  return (
    <div>
      <h1 className="titulo">⚽ Fulbo Live</h1>
      {/* Nombre del canal *//*} 
      {canalName && <h2>{canalName}</h2>} {/* Muestra el nombre del canal aquí *//*}

      {videoLinks.length > 0 ? (
        <>
          {currentLink.includes(".m3u8") ? (
            <video ref={videoRef} controls width="800" height="450"></video>
          ) : (
            <iframe
              src={currentLink}
              width="800"
              height="450"
              allowFullScreen
              title={canalName}
            ></iframe>
          )}
          <div>
            {videoLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => handleLinkClick(link)}
                disabled={link === currentLink}
              >
                {`Opción ${index + 1}`}
              </button>
            ))}
          </div>
        </>
      ) : (
        <h2>⚠️ Error: No hay enlaces disponibles</h2>
      )}
      <h2 className="titulo">⚽ Bienvenido a Fulbo</h2>
    </div>
  );
};

export default Player;
*/
