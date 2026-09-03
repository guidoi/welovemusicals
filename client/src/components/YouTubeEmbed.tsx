/**
 * YouTubeEmbed-Komponente
 * Zeigt ein YouTube-Video mit Standbild und Play-Button
 * YouTube wird erst nach einer Einwilligung und einem zusätzlichen Klick geladen.
 */
import React, { useState } from "react";
import { Play, ShieldCheck } from "lucide-react";
import { useConsent } from "@/contexts/ConsentContext";
import { getTrailerThumbnail } from "@/lib/youtube-thumbnails";

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
}

export default function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { consent, openSettings } = useConsent();
  const canLoadYouTube = consent?.externalMedia === true;
  const thumbnailSrc = getTrailerThumbnail(videoId);

  const startVideo = () => {
    if (!canLoadYouTube) {
      openSettings();
      return;
    }
    setIsPlaying(true);
  };

  if (isPlaying) {
    return (
      <div className="w-full bg-black rounded-lg overflow-hidden">
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title || "YouTube Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full rounded-lg overflow-hidden cursor-pointer group"
      onClick={startVideo}
      role="button"
      tabIndex={0}
      aria-label={`Video abspielen: ${title || "YouTube Video"}`}
      onKeyDown={(e) => e.key === "Enter" && startVideo()}
    >
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        {thumbnailSrc ? (
          <img
            src={thumbnailSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(212,175,55,0.28),transparent_34%),linear-gradient(135deg,#211215,#060506_72%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 transition-all duration-300 group-hover:from-black/90" />

        {/* Play Button – YouTube-Stil mit Gold-Akzent */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            {/* Pulsierender Ring */}
            <div className="absolute w-20 h-20 rounded-full bg-gold/20 group-hover:scale-110 transition-transform duration-300" />
            {/* Hauptkreis */}
            <div className="relative w-16 h-16 rounded-full bg-gold/90 group-hover:bg-gold flex items-center justify-center shadow-lg shadow-black/50 transition-all duration-300 group-hover:scale-105">
              <Play className="w-7 h-7 text-black fill-black ml-1" />
            </div>
          </div>
        </div>

        {!canLoadYouTube && (
          <div className="absolute inset-x-5 bottom-5 flex items-start gap-2 rounded-sm border border-white/15 bg-black/55 p-3 text-left text-xs leading-relaxed text-white/80 backdrop-blur-sm">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <span>Mit „Externe Medien & Schriftarten“ lädst du YouTube und stimmst der Datenübertragung an YouTube zu.</span>
          </div>
        )}

        {/* Titel unten links */}
        {title && (
          <div className={`absolute bottom-0 left-0 right-0 p-4 ${!canLoadYouTube ? "pb-20" : ""}`}>
            <p className="text-sm font-medium text-white/90 line-clamp-1 drop-shadow">{title}</p>
          </div>
        )}
      </div>
    </div>
  );
}
