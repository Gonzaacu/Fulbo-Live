import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Hls from "hls.js"; // Importamos HLS.js
import canales from "../data/canales"; // Importamos los datos

const Player = () => {
  const location = useLocation();
  const [videoLinks, setVideoLinks] = useState([]);
  const [currentLink, setCurrentLink] = useState("");
  const [canalName, setCanalName] = useState("");
  const videoRef = useRef(null);
  const hlsRef = useRef(null); // Guardamos la instancia de Hls.js

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const nameParam = queryParams.get("name");

    if (nameParam) {
      setCanalName(nameParam);
      console.log(`📺 Canal seleccionado: ${nameParam}`);

      const canalSeleccionado = Object.entries(canales).find(
        ([nombre]) => nombre === nameParam
      );

      if (canalSeleccionado) {
        const [, enlaces] = canalSeleccionado;
        setVideoLinks(enlaces);
        setCurrentLink(enlaces[0]); // Reproducir el primer enlace
      } else {
        console.error("⚠️ Error: Canal no encontrado.");
      }
    }
  }, [location]);

  useEffect(() => {
    if (!currentLink || !videoRef.current) return;

    console.log(`🔗 Cargando stream: ${currentLink}`);

    if (hlsRef.current) {
      hlsRef.current.destroy(); // Destruir instancia anterior antes de crear una nueva
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls; // Guardamos la instancia
      hls.loadSource(currentLink);
      hls.attachMedia(videoRef.current);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("✅ MANIFEST cargado correctamente");
        videoRef.current.play();
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("❌ Error en HLS:", data);
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = currentLink;
      videoRef.current.addEventListener("loadedmetadata", () => {
        videoRef.current.play();
      });
    } else {
      console.error("⚠️ HLS no es compatible con este navegador.");
    }
  }, [currentLink]);

  const handleLinkClick = (link) => {
    console.log(`🖱️ Cambiando a: ${link}`);
    setCurrentLink(link);
  };

  return (
    <div>
      <h1>{canalName} - Transmisión en Vivo</h1>
      {videoLinks.length > 0 ? (
        <>
          <video ref={videoRef} controls width="800" height="450"></video>
          <div>
            <h3>Selecciona otra opción:</h3>
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
    </div>
  );
};

export default Player;
