/**
 * Lokal ausgelieferte Trailer-Vorschaubilder. Die eigentlichen YouTube-Player
 * werden weiterhin erst nach Zustimmung für externe Medien geladen.
 */
export const trailerThumbnailByVideoId: Record<string, string> = {
  "9lJc0EM-jBo": "/manus-storage/9lJc0EM-jBo_0e36af7b.jpg",
  BN8RYBCYPVM: "/manus-storage/BN8RYBCYPVM_afc91cf8.jpg",
  A02SZ71tgRI: "/manus-storage/A02SZ71tgRI_8a19ef10.jpg",
  "9LJMaLj8Ino": "/manus-storage/9LJMaLj8Ino_7df5d507.jpg",
  B0vHUyLx2Ac: "/manus-storage/B0vHUyLx2Ac_adf8d183.jpg",
  IWrg3s9gMsY: "/manus-storage/IWrg3s9gMsY_1ab25d3c.jpg",
  fmbGACDjs0E: "/manus-storage/fmbGACDjs0E_2b214f7a.jpg",
  BqOiOukh3KQ: "/manus-storage/BqOiOukh3KQ_fc068a13.jpg",
  LXl2EgjktuE: "/manus-storage/LXl2EgjktuE_74c555fe.jpg",
  cwLZ_5EML5U: "/manus-storage/cwLZ_5EML5U_b2dd177c.jpg",
  "-N3CbbBAyMM": "/manus-storage/-N3CbbBAyMM_d1f330d7.jpg",
  sTGDPyXsJRI: "/manus-storage/sTGDPyXsJRI_9641d505.jpg",
  saissbQkgjA: "/manus-storage/saissbQkgjA_89e64e99.jpg",
  HkAeCFClDFg: "/manus-storage/HkAeCFClDFg_c0090267.jpg",
  bKGqV1ovqbc: "/manus-storage/bKGqV1ovqbc_913261b9.jpg",
  "9zPIQ43Iwwc": "/manus-storage/9zPIQ43Iwwc_5bef00af.jpg",
  q2cWpBQX62Q: "/manus-storage/q2cWpBQX62Q_e2330fae.jpg",
  o7OjpWsGkbY: "/manus-storage/o7OjpWsGkbY_db7d8b5b.jpg",
  "2W1AQr11rqo": "/manus-storage/2W1AQr11rqo_e62ca803.jpg",
};

export function getTrailerThumbnail(videoId: string): string | undefined {
  return trailerThumbnailByVideoId[videoId];
}
