"use client";

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Importar o QRCodeSVG
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ImageDisplay() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const router = useRouter();
  const [timer, setTimer] = useState<number>(180); // Timer para 3 minutos

  useEffect(() => {
    const storedImage = localStorage.getItem('capturedImage');
    if (storedImage) {
      setImageSrc(storedImage);
    }

    // Iniciar o timer para voltar à tela inicial após 3 minutos
    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev === 0) {
          clearInterval(countdown);
          router.push("/"); // Voltar à tela inicial após 3 minutos
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [router]);

  // Gerar o valor do QR code com a imagem base64 embutida
  const qrCodeLink = imageSrc
    ? `${window.location.origin}/email-form?imageSrc=${encodeURIComponent(imageSrc)}`
    : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat relative">
      {/* QR Code que redireciona para a página do formulário, com a imagem embutida na URL */}
      {qrCodeLink && (
        <div className="absolute top-4 left-4">
          <QRCodeSVG value={qrCodeLink} size={100} />
        </div>
      )}

      <img
        src="/topcaixa.svg"
        alt="Top Caixa"
        className="absolute top-24 left-1/2 transform -translate-x-1/2 w-2/5 h-auto"
      />

      <img
        src="/detalhesuperiordireito.svg"
        alt="Detalhe Superior Direito"
        className="absolute top-0 right-0 w-3/5 h-auto"
      />

      {imageSrc ? (
        <img src={imageSrc} alt="Captured" className="w-full h-auto object-contain" />
      ) : (
        <p>Imagem não disponível</p>
      )}

      <img
        src="/molduraphoto.svg"
        alt="Moldura Photo"
        className="absolute bottom-44 left-1/2 transform -translate-x-1/2 w-3/5 h-auto"
      />

      <Link href="/">
        <button className="absolute bottom-20 left-1/2 transform -translate-x-1/2 p-4">
          <img src="/photoretry.svg" alt="Retry Button" className="w-52 h-52" />
        </button>
      </Link>

      <footer className="w-full h-36 flex items-center justify-center gap-4 border-b border-[#222222] bg-[#1B1B1B]">
        <img src="/termosdeuso.svg" alt="Termos de Uso" className="h-[40%] -ml-2" />
        <img src="/s4slogo.svg" alt="S4S Logo" className="h-[30%] ml-36" />
        <img src="/instagram.svg" alt="Instagram" className="h-[25%]" />
      </footer>
    </div>
  );
}
