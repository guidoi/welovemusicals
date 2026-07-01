/**
 * YouTubeEmbed-Komponente
 * Zeigt ein YouTube-Video mit Standbild und Play-Button
 * Video wird erst nach Klick geladen (Lazy Loading)
 * Fallback: maxresdefault → hqdefault → sddefault
 * Erkennt YouTube-Placeholder-Bilder (120x90) und fällt automatisch zurück
 */
import { useState } from "react";
import { Play } from "lucide-react";

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
}

export default function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnailQuality, setThumbnailQuality] = useState<"maxresdefault" | "hqdefault" | "sddefault">("maxresdefault");

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${thumbnailQuality}.jpg`;

  const handleThumbnailError = () => {
    if (thumbnailQuality === "maxresdefault") setThumbnailQuality("hqdefault");
    else if (thumbnailQuality === "hqdefault") setThumbnailQuality("sddefault");
  };

  // YouTube returns a small placeholder image (120x90) when maxresdefault doesn't exist
  // instead of a proper 404. Detect this by checking naturalWidth.
  const handleThumbnailLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (thumbnailQuality === "maxresdefault" && img.naturalWidth <= 120) {
      setThumbnailQuality("hqdefault");
    }
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
      onClick={() => setIsPlaying(true)}
      role="button"
      tabIndex={0}
      aria-label={`Video abspielen: ${title || "YouTube Video"}`}
      onKeyDown={(e) => e.key === "Enter" && setIsPlaying(true)}
    >
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        {/* Thumbnail */}
        <img
          src={thumbnailUrl}
          alt={title || "YouTube Video Thumbnail"}
          className="absolute top-0 left-0 w-full h-full object-cover"
          onError={handleThumbnailError}
          onLoad={handleThumbnailLoad}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300" />

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

        {/* Titel unten links */}
        {title && (
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-sm font-medium text-white/90 line-clamp-1 drop-shadow">{title}</p>
          </div>
        )}
      </div>
    </div>
  );
}
