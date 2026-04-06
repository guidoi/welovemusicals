/**
 * MusicalKeyVisual-Komponente
 * Zeigt ein quadratisches Keyvisual-Bild für das Musical
 */

interface MusicalKeyVisualProps {
  image: string;
  title: string;
}

export default function MusicalKeyVisual({ image, title }: MusicalKeyVisualProps) {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="aspect-square rounded-lg overflow-hidden shadow-xl border-4 border-accent/20">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
    </div>
  );
}
