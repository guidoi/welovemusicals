/**
 * YouTubeEmbed-Komponente
 * Zeigt ein YouTube-Video mit Standbild und Play-Button
 * Video wird erst nach Klick geladen
 */
import { useState } from "react";
import { Play } from "lucide-react";

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
}

export default function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // YouTube Thumbnail URL (maxresdefault ist die höchste Qualität)
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

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
    <div className="w-full rounded-lg overflow-hidden">
      <div className="relative w-full cursor-pointer group" style={{ paddingBottom: "56.25%" }}>
        {/* Standbild */}
        <img
          src={thumbnailUrl}
          alt={title || "YouTube Video Thumbnail"}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />

        {/* Dunkler Overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />

        {/* Play Button */}
        <button
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 flex items-center justify-center"
          aria-label="Video abspielen"
        >
          <div className="relative">
            {/* Äußerer Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-white/80 group-hover:border-white transition-colors duration-300" 
              style={{
                width: "80px",
                height: "80px",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
              }}
            />

            {/* Play Icon */}
            <div className="relative flex items-center justify-center"
              style={{
                width: "80px",
                height: "80px"
              }}
            >
              <Play
                className="w-10 h-10 text-white fill-white group-hover:scale-110 transition-transform duration-300"
                style={{
                  marginLeft: "4px" // Visuelle Zentrierung des Play-Icons
                }}
              />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
