/*
 * PLZ-Umkreissuche – Nutzer gibt PLZ + Radius ein, zeigt Musicals in der Nähe
 * Nutzt statische PLZ-Datenbank (8.298 Einträge, ~205 KB) + Haversine-Formel
 */
import { useState, useCallback } from "react";
import { MapPin, Search, X, Loader2, Navigation } from "lucide-react";

// Stadtkoordinaten für alle Musical-Spielorte
const CITY_COORDS: Record<string, [number, number]> = {
  "Hamburg": [53.5753, 10.0153],
  "Stuttgart": [48.7758, 9.1829],
  "Berlin": [52.5200, 13.4050],
  "München": [48.1351, 11.5820],
  "Köln": [50.9333, 6.9500],
  "Frankfurt": [50.1109, 8.6821],
  "Frankfurt am Main": [50.1109, 8.6821],
  "Frankfurt (Oder)": [52.3418, 14.5517],
  "Düsseldorf": [51.2217, 6.7762],
  "Leipzig": [51.3397, 12.3731],
  "Dresden": [51.0504, 13.7373],
  "Hannover": [52.3759, 9.7320],
  "Bremen": [53.0793, 8.8017],
  "Bochum": [51.4818, 7.2162],
  "Graz": [47.0707, 15.4395],
  "Wien": [48.2082, 16.3738],
  "Innsbruck": [47.2692, 11.4041],
  "Linz": [48.3069, 14.2858],
  "Zürich": [47.3769, 8.5417],
  "Duisburg": [51.4344, 6.7623],
  "Nürnberg": [49.4521, 11.0767],
  "Halle (Saale)": [51.4828, 11.9697],
  "Dortmund": [51.5136, 7.4653],
  "Essen": [51.4556, 7.0116],
  "Wetzlar": [50.5598, 8.5035],
  "Ludwigsburg": [48.8975, 9.1919],
  "Solingen": [51.1651, 7.0847],
  "Hildesheim": [52.1537, 9.9511],
  "Aachen": [50.7753, 6.0839],
  "Bielefeld": [52.0302, 8.5325],
  "Braunschweig": [52.2689, 10.5268],
  "Magdeburg": [52.1205, 11.6276],
  "Rostock": [54.0887, 12.1400],
  "Kiel": [54.3233, 10.1228],
  "Augsburg": [48.3705, 10.8978],
  "Mannheim": [49.4875, 8.4660],
  "Karlsruhe": [49.0069, 8.4037],
  "Freiburg": [47.9990, 7.8421],
  "Mainz": [49.9929, 8.2473],
  "Wiesbaden": [50.0782, 8.2398],
  "Kassel": [51.3127, 9.4797],
  "Erfurt": [50.9848, 11.0299],
  "Jena": [50.9272, 11.5892],
  "Weimar": [50.9795, 11.3235],
  "Saarbrücken": [49.2354, 6.9969],
  "Koblenz": [50.3569, 7.5890],
  "Trier": [49.7490, 6.6371],
  "Osnabrück": [52.2799, 8.0472],
  "Münster": [51.9607, 7.6261],
  "Paderborn": [51.7189, 8.7575],
  "Gütersloh": [51.9065, 8.3780],
  "Siegen": [50.8748, 8.0243],
  "Hagen": [51.3671, 7.4633],
  "Herne": [51.5386, 7.2237],
  "Unna": [51.5345, 7.6886],
  "Neuss": [51.1983, 6.6878],
  "Aschaffenburg": [49.9769, 9.1518],
  "Würzburg": [49.7913, 9.9534],
  "Regensburg": [49.0134, 12.1016],
  "Ulm": [48.3984, 9.9917],
  "Heilbronn": [49.1427, 9.2109],
  "Ravensburg": [47.7819, 9.6116],
  "Flensburg": [54.7835, 9.4366],
  "Lüneburg": [53.2509, 10.4022],
  "Wolfsburg": [52.4227, 10.7865],
  "Göttingen": [51.5413, 9.9158],
  "Cottbus": [51.7563, 14.3329],
  "Schwerin": [53.6355, 11.4012],
  "Zwickau": [50.7168, 12.4953],
  "Chemnitz": [50.8278, 12.9214],
  "Gera": [50.8781, 12.0812],
  "Suhl": [50.6092, 10.6942],
  "Dornbirn": [47.4125, 9.7417],
  "Puch bei Salzburg": [47.7500, 13.0833],
  "Bad Ischl": [47.7137, 13.6196],
  "Vöcklabruck": [48.0035, 13.6565],
  "Ried im Innkreis": [48.2097, 13.4878],
  "Salzburg": [47.8095, 13.0550],
  "Fulda": [50.5517, 9.6755],
  "Landau": [49.1983, 8.1167],
  "Limburg": [50.3833, 8.0667],
  "Offenburg": [48.4728, 7.9408],
  "Singen": [47.7594, 8.8397],
  "Tuttlingen": [47.9843, 8.8178],
  "Donaueschingen": [47.9500, 8.5000],
  "Aurich": [53.4693, 7.4836],
  "Bremerhaven": [53.5396, 8.5809],
  "Cloppenburg": [52.8483, 8.0444],
  "Husum": [54.4806, 9.0528],
  "Hameln": [52.1039, 9.3604],
  "Uelzen": [52.9662, 10.5635],
  "Bitburg": [49.9736, 6.5225],
  "Idar-Oberstein": [49.7072, 7.2720],
  "Zweibrücken": [49.2478, 7.3608],
  "Crailsheim": [49.1333, 10.0667],
  "Heidenheim": [48.6767, 10.1533],
  "Gersthofen": [48.4233, 10.8767],
  "Lindau": [47.5447, 9.6842],
  "Bad Neustadt a. d. Saale": [50.3237, 10.2156],
  "Weiden i. d. Oberpfalz": [49.6767, 12.1567],
  "Hanau": [50.1333, 8.9167],
  "Wuppertal": [51.2562, 7.1508],
  "Gelsenkirchen": [51.5177, 7.0857],
  "Pforzheim": [48.8921, 8.6975],
  "Erlangen": [49.5897, 11.0078],
  "Fürth": [49.4772, 10.9888],
  "Passau": [48.5742, 13.4578],
  "Kempten": [47.7267, 10.3147],
  "Memmingen": [47.9878, 10.1814],
  "Rosenheim": [47.8561, 12.1289],
  "Landshut": [48.5369, 12.1519],
  "Bayreuth": [49.9456, 11.5713],
  "Coburg": [50.2592, 10.9628],
  "Schweinfurt": [50.0503, 10.2231],
  "Ansbach": [49.3017, 10.5714],
  "Potsdam": [52.3906, 13.0645],
  "Lübeck": [53.8655, 10.6866],
  "Krefeld": [51.3388, 6.5853],
  "Mönchengladbach": [51.1805, 6.4428],
  "Oberhausen": [51.4963, 6.8637],
  "Remscheid": [51.1797, 7.1897],
  "Darmstadt": [49.8728, 8.6512],
  "Bamberg": [49.8988, 10.9028],
  "Ingolstadt": [48.7665, 11.4257],
  "Reutlingen": [48.4914, 9.2043],
  "Konstanz": [47.6603, 9.1758],
  "Basel": [47.5596, 7.5886],
  "Bern": [46.9480, 7.4474],
  "Genf": [46.2044, 6.1432],
};

// Haversine-Formel: Luftlinienabstand in km
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// PLZ-Datenbank (lazy-loaded)
let plzDb: Record<string, [number, number]> | null = null;
let plzDbLoading = false;
let plzDbCallbacks: Array<(db: Record<string, [number, number]>) => void> = [];

async function loadPlzDb(): Promise<Record<string, [number, number]>> {
  if (plzDb) return plzDb;
  if (plzDbLoading) {
    return new Promise((resolve) => plzDbCallbacks.push(resolve));
  }
  plzDbLoading = true;
  const res = await fetch("/plz_de.json");
  plzDb = await res.json();
  plzDbLoading = false;
  plzDbCallbacks.forEach((cb) => cb(plzDb!));
  plzDbCallbacks = [];
  return plzDb!;
}

export interface PlzSearchState {
  active: boolean;
  plz: string;
  radius: number;
  originCoords: [number, number] | null;
  originCity?: string;
}

interface PlzSearchProps {
  state: PlzSearchState;
  onChange: (state: PlzSearchState) => void;
}

const RADIUS_OPTIONS = [25, 50, 100, 150, 200, 300, 500];

export default function PlzSearch({ state, onChange }: PlzSearchProps) {
  const [inputPlz, setInputPlz] = useState(state.plz);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (plz: string, radius: number) => {
    const cleanPlz = plz.trim().replace(/\s/g, "");
    if (cleanPlz.length !== 5 || !/^\d{5}$/.test(cleanPlz)) {
      setError("Bitte eine gültige 5-stellige PLZ eingeben");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const db = await loadPlzDb();
      const coords = db[cleanPlz];
      if (!coords) {
        setError(`PLZ ${cleanPlz} nicht gefunden`);
        setLoading(false);
        return;
      }
      // Nächste bekannte Stadt für Anzeige ermitteln
      let nearestCity = "";
      let nearestDist = Infinity;
      for (const [city, cityCoords] of Object.entries(CITY_COORDS)) {
        const d = haversineKm(coords[0], coords[1], cityCoords[0], cityCoords[1]);
        if (d < nearestDist) { nearestDist = d; nearestCity = city; }
      }
      onChange({
        active: true,
        plz: cleanPlz,
        radius,
        originCoords: coords,
        originCity: nearestDist < 50 ? nearestCity : undefined,
      });
    } catch {
      setError("Fehler beim Laden der PLZ-Datenbank");
    }
    setLoading(false);
  }, [onChange]);

  const handleClear = () => {
    setInputPlz("");
    setError(null);
    onChange({ active: false, plz: "", radius: state.radius, originCoords: null });
  };

  const handleRadiusChange = (newRadius: number) => {
    if (state.active && state.originCoords) {
      onChange({ ...state, radius: newRadius });
    } else {
      onChange({ ...state, radius: newRadius });
    }
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setError("Geolocation wird von diesem Browser nicht unterstützt");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        // Nächste PLZ aus Datenbank finden
        const db = await loadPlzDb();
        let nearestPlz = "";
        let nearestDist = Infinity;
        for (const [plz, coords] of Object.entries(db)) {
          const d = haversineKm(latitude, longitude, coords[0], coords[1]);
          if (d < nearestDist) { nearestDist = d; nearestPlz = plz; }
        }
        setInputPlz(nearestPlz);
        await handleSearch(nearestPlz, state.radius);
      },
      () => {
        setError("Standort konnte nicht ermittelt werden");
        setLoading(false);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="border border-border/50 rounded-sm p-3 bg-card/50 space-y-3">
      <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">
        <MapPin className="w-3 h-3 inline mr-1 text-gold/70" />
        Umkreissuche
      </label>

      {/* PLZ Eingabe + Suche */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            inputMode="numeric"
            maxLength={5}
            placeholder="PLZ eingeben…"
            value={inputPlz}
            onChange={(e) => {
              setInputPlz(e.target.value.replace(/\D/g, "").slice(0, 5));
              setError(null);
              if (!e.target.value) handleClear();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch(inputPlz, state.radius);
            }}
            className="w-full px-3 py-2 text-sm rounded-sm border border-border bg-background text-foreground focus:border-gold outline-none transition-colors pr-8"
          />
          {(inputPlz || state.active) && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Zurücksetzen"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={() => handleSearch(inputPlz, state.radius)}
          disabled={loading || inputPlz.length !== 5}
          className="px-3 py-2 rounded-sm text-sm font-medium transition-all disabled:opacity-40"
          style={{ backgroundColor: 'rgba(184,148,74,0.15)', color: '#b8944a', border: '1px solid rgba(184,148,74,0.3)' }}
          aria-label="Suchen"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </button>
        <button
          onClick={handleGeolocate}
          disabled={loading}
          title="Meinen Standort verwenden"
          className="px-3 py-2 rounded-sm text-sm transition-all disabled:opacity-40 border border-border/50 text-muted-foreground hover:text-foreground hover:border-gold/30"
          aria-label="Standort ermitteln"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>

      {/* Radius-Auswahl */}
      <div className="flex flex-wrap gap-1.5">
        {RADIUS_OPTIONS.map((r) => (
          <button
            key={r}
            onClick={() => handleRadiusChange(r)}
            className="px-2.5 py-1 text-xs rounded-sm border transition-all"
            style={
              state.radius === r
                ? { backgroundColor: 'rgba(184,148,74,0.2)', color: '#b8944a', borderColor: 'rgba(184,148,74,0.5)' }
                : { backgroundColor: 'transparent', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }
            }
          >
            {r} km
          </button>
        ))}
      </div>

      {/* Fehlermeldung */}
      {error && <p className="text-xs text-red-400">{error}</p>}

      {/* Aktiver Filter-Hinweis */}
      {state.active && state.originCoords && (
        <p className="text-xs" style={{ color: '#b8944a' }}>
          <MapPin className="w-3 h-3 inline mr-1" />
          Umkreis {state.radius} km um PLZ {state.plz}
          {state.originCity && ` (${state.originCity})`}
        </p>
      )}
    </div>
  );
}

// Hilfsfunktion: Prüft ob ein Musical im Umkreis liegt
export function musicalInRadius(
  musical: { city?: string; cities?: string[]; tourDates?: { city: string }[] },
  originCoords: [number, number],
  radiusKm: number
): boolean {
  const allCities = [
    ...(musical.city ? [musical.city] : []),
    ...(musical.cities || []),
    ...(musical.tourDates?.map((t) => t.city) || []),
  ];
  return allCities.some((city) => {
    const coords = CITY_COORDS[city];
    if (!coords) return false;
    return haversineKm(originCoords[0], originCoords[1], coords[0], coords[1]) <= radiusKm;
  });
}
