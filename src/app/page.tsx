"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [filter, setFilter] = useState<string>("none");
  const [currentFilterIndex, setCurrentFilterIndex] = useState<number>(-1);
  const [overlayImage, setOverlayImage] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const router = useRouter(); 

  const filters = [
    { name: "Filtro Ceará", filter: "none", svg: "/filterceara.svg", overlay: "/Ceara.png" },
    { name: "Filtro Fortaleza", filter: "none", svg: "/filterfortaleza.svg", overlay: "/Fortaleza.png" },
    { name: "Filtro André Fernandes", filter: "none", svg: "/filterandrefernandes.svg", overlay: "/Andre.png" },
    { name: "Filtro Evandro Leitão", filter: "none", svg: "/leitao.svg", overlay: "/leitao.png" },
    { name: "Filtro s4S e STS", filter: "none", svg: "/s4s.svg", overlay: "/S4s.png" }
  ];

  useEffect(() => {
    async function startVideo() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Erro ao acessar a câmera: ", error);
      }
    }

    startVideo();
  }, []);

  useEffect(() => {
    if (currentFilterIndex >= 0) {
      setFilter(filters[currentFilterIndex].filter);
      setOverlayImage(filters[currentFilterIndex].overlay);
    } else {
      setFilter("none");
      setOverlayImage("");
    }
  }, [currentFilterIndex]);

  const applyFilter = (index: number) => {
    setCurrentFilterIndex(index);
    setIsFullscreen(true);
  };

  const handleCapture = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (videoRef.current && context) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      if (overlayImage) {
        const img = new Image();
        img.src = overlayImage;
        img.onload = () => {
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
          const capturedImageData = canvas.toDataURL("image/png");
          
          localStorage.setItem('capturedImage', capturedImageData);

          router.push('/imagepage');
        };
      } else {
        const capturedImageData = canvas.toDataURL("image/png");
        
        localStorage.setItem('capturedImage', capturedImageData);

        router.push('/imagepage');
      }
    }
  };

  const handleBack = () => {
    setIsFullscreen(false);
    setCurrentFilterIndex(-1);
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-cover bg-center bg-no-repeat">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute top-0 left-0 w-full h-full object-cover ${isFullscreen ? "" : "-z-10"}`}
        style={{ filter }}
      />

      {overlayImage && isFullscreen && (
        <img
          src={overlayImage}
          alt="Overlay"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      )}

      {!isFullscreen && (
        <>
          <div className="flex justify-center mt-40 ml-[23%] w-[572px] h-32 items-center bg-[#1F1F1FE5] rounded-[60px]">
            <p className="text-white text-center font-poppins text-[32px] font-semibold leading-[48px] tracking-[0.02em]">
              Crie sua foto interativa com a{" "}
              <span className="text-[#FF9700]">s4S.tech</span>, vamos lá?
            </p>
          </div>

          <div className="flex-grow"></div>

          <div className="flex justify-center">
            <img src="/sia.svg" alt="SIA Logo" className="w-[750px] h-[750px] -mb-64" />
          </div>

          <div className="relative w-full flex justify-center items-center mt-10 mb-12 mx-auto space-x-4">
            {filters.map((filterItem, index) => (
              <div
                key={index}
                className="rounded-full w-44 h-44 flex justify-center items-center cursor-pointer"
                onClick={() => applyFilter(index)}
              >
                <img
                  src={filterItem.svg}
                  alt={filterItem.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </>
      )}

      {isFullscreen && (
        <>
          <button
            onClick={handleCapture}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <img src="/shutter.svg" alt="Shutter Button" className="w-36 h-36" />
          </button>

          <button
            onClick={handleBack}
            className="absolute -top-8 left-10 p-4 rounded-full"
          >
            <img src="/back.svg" alt="Back Button" className="w-56 h-56" />
          </button>
        </>
      )}

      <footer className="w-full h-36 flex items-center justify-center gap-4 border-b border-[#222222] bg-[#1B1B1B]">
        <img src="/termosdeuso.svg" alt="Termos de Uso" className="h-[40%] -ml-2" />
        <img src="/s4slogo.svg" alt="S4S Logo" className="h-[30%] ml-36" />
        <img src="/instagram.svg" alt="Instagram" className="h-[25%]" />
      </footer>
    </div>
  );
}
