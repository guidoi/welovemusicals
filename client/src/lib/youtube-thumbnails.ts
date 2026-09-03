/**
 * Lokal ausgelieferte Trailer-Vorschaubilder. Die eigentlichen YouTube-Player
 * werden weiterhin erst nach Zustimmung für externe Medien geladen.
 */
export const trailerThumbnailByVideoId: Record<string, string> = {
  "9lJc0EM-jBo": "/images/show-visuals/trailer-thumbnails/9lJc0EM-jBo.jpg",
  BN8RYBCYPVM: "/images/show-visuals/trailer-thumbnails/BN8RYBCYPVM.jpg",
  A02SZ71tgRI: "/images/show-visuals/trailer-thumbnails/A02SZ71tgRI.jpg",
  "9LJMaLj8Ino": "/images/show-visuals/trailer-thumbnails/9LJMaLj8Ino.jpg",
  B0vHUyLx2Ac: "/images/show-visuals/trailer-thumbnails/B0vHUyLx2Ac.jpg",
  IWrg3s9gMsY: "/images/show-visuals/trailer-thumbnails/IWrg3s9gMsY.jpg",
  fmbGACDjs0E: "/images/show-visuals/trailer-thumbnails/fmbGACDjs0E.jpg",
  BqOiOukh3KQ: "/images/show-visuals/trailer-thumbnails/BqOiOukh3KQ.jpg",
  LXl2EgjktuE: "/images/show-visuals/trailer-thumbnails/LXl2EgjktuE.jpg",
  cwLZ_5EML5U: "/images/show-visuals/trailer-thumbnails/cwLZ_5EML5U.jpg",
  "-N3CbbBAyMM": "/images/show-visuals/trailer-thumbnails/-N3CbbBAyMM.jpg",
  sTGDPyXsJRI: "/images/show-visuals/trailer-thumbnails/sTGDPyXsJRI.jpg",
  saissbQkgjA: "/images/show-visuals/trailer-thumbnails/saissbQkgjA.jpg",
  HkAeCFClDFg: "/images/show-visuals/trailer-thumbnails/HkAeCFClDFg.jpg",
  bKGqV1ovqbc: "/images/show-visuals/trailer-thumbnails/bKGqV1ovqbc.jpg",
  "9zPIQ43Iwwc": "/images/show-visuals/trailer-thumbnails/9zPIQ43Iwwc.jpg",
  q2cWpBQX62Q: "/images/show-visuals/trailer-thumbnails/q2cWpBQX62Q.jpg",
  o7OjpWsGkbY: "/images/show-visuals/trailer-thumbnails/o7OjpWsGkbY.jpg",
  "2W1AQr11rqo": "/images/show-visuals/trailer-thumbnails/2W1AQr11rqo.jpg",
};

export function getTrailerThumbnail(videoId: string): string | undefined {
  return trailerThumbnailByVideoId[videoId];
}
