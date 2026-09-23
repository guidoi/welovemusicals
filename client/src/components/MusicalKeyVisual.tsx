/**
 * MusicalKeyVisual-Komponente
 * Zeigt das Keyvisual-Bild für das Musical.
 * - Standard: quadratisches Seitenverhältnis (aspect-square), object-cover
 * - landscape: Bild in natürlicher Proportion (kein fester Aspect-Ratio-Container),
 *   damit breite Querformat-Bilder vollständig sichtbar sind
 */

import React from "react";

interface MusicalKeyVisualProps {
  image: string;
  title: string;
  ticketLink?: string;
  landscape?: boolean; // Querformat: natürliche Bildproportion, kein Abschneiden
  ticketProvider?: string; // z.B. 'ATG Tickets' oder 'Eventim'
  linkPurpose?: "tickets" | "show-page";
  onTicketClick?: () => void;
}

export default function MusicalKeyVisual({ image, title, ticketLink, landscape, ticketProvider = 'Eventim', linkPurpose = "tickets", onTicketClick }: MusicalKeyVisualProps) {
  const imgEl = landscape ? (
    // Querformat: Bild in voller Breite, Höhe automatisch nach Proportion
    <img
      src={image}
      alt={title}
      className="w-full h-auto rounded-lg hover:opacity-95 transition-opacity duration-300"
    />
  ) : (
    // Standard: quadratisch, object-cover
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
          title={linkPurpose === "show-page"
            ? `Offizielle Showseite von ${title} bei ${ticketProvider} öffnen`
            : `Tickets für ${title} über ${ticketProvider} kaufen`}
          onClick={onTicketClick}
        >
          {imgEl}
        </a>
      ) : (
        imgEl
      )}
    </div>
  );
}
