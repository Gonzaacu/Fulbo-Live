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
      {/* Nombre del canal */}
      {canalName && <h2>{canalName}</h2>} {/* Muestra el nombre del canal aquí */}

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
