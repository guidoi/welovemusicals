/**
 * MusicalKeyVisual-Komponente
 * Zeigt ein quadratisches Keyvisual-Bild für das Musical
 * Mit Link zur Eventim-Ticket-Landingpage
 */

interface MusicalKeyVisualProps {
  image: string;
  title: string;
  ticketLink?: string;
}

export default function MusicalKeyVisual({ image, title, ticketLink }: MusicalKeyVisualProps) {
  const content = (
    <div className="aspect-square rounded-lg overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      {ticketLink ? (
        <a
          href={ticketLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block group cursor-pointer"
          title={`Tickets für ${title} auf Eventim kaufen`}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}
