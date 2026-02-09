// Pre-geocoded coordinates for common Hungarian cities
// This helps avoid rate limiting from Nominatim API
export const hungarianCities: Record<string, { lat: number; lng: number }> = {
  Budapest: { lat: 47.4979, lng: 19.0402 },
  Debrecen: { lat: 47.5316, lng: 21.6273 },
  Szeged: { lat: 46.253, lng: 20.1414 },
  Miskolc: { lat: 48.1035, lng: 20.7784 },
  Pécs: { lat: 46.0727, lng: 18.232 },
  Győr: { lat: 47.6875, lng: 17.6504 },
  Nyíregyháza: { lat: 47.9559, lng: 21.7186 },
  Kecskemét: { lat: 46.9062, lng: 19.6913 },
  Székesfehérvár: { lat: 47.19, lng: 18.4108 },
  Szombathely: { lat: 47.2306, lng: 16.6218 },
  Szolnok: { lat: 47.1747, lng: 20.1993 },
  Tatabánya: { lat: 47.5692, lng: 18.4041 },
  Kaposvár: { lat: 46.3594, lng: 17.7967 },
  Érd: { lat: 47.3895, lng: 18.9145 },
  Veszprém: { lat: 47.0929, lng: 17.9093 },
  Békéscsaba: { lat: 46.6761, lng: 21.0896 },
  Zalaegerszeg: { lat: 46.84, lng: 16.8444 },
  Sopron: { lat: 47.685, lng: 16.5839 },
  Eger: { lat: 47.9026, lng: 20.377 },
  Nagykanizsa: { lat: 46.453, lng: 16.9908 },
  Dunaújváros: { lat: 46.9619, lng: 18.935 },
  Hódmezővásárhely: { lat: 46.4181, lng: 20.3294 },
  Salgótarján: { lat: 48.0983, lng: 19.8033 },
  Cegléd: { lat: 47.1717, lng: 19.8014 },
  Baja: { lat: 46.1819, lng: 18.9553 },
  Esztergom: { lat: 47.7928, lng: 18.7436 },
  Gyula: { lat: 46.65, lng: 21.2833 },
  Vác: { lat: 47.7758, lng: 19.1347 },
  Pápa: { lat: 47.33, lng: 17.4667 },
  Hajdúböszörmény: { lat: 47.6694, lng: 21.5119 },
  Keszthely: { lat: 46.7683, lng: 17.25 },
  Orosháza: { lat: 46.5667, lng: 20.6667 },
  Tiszakécske: { lat: 46.9333, lng: 20.1 },
  Mosonmagyaróvár: { lat: 47.8681, lng: 17.2708 },
  Kiskunfélegyháza: { lat: 46.7167, lng: 19.85 },
  Komló: { lat: 46.19, lng: 18.2556 },
  Siófok: { lat: 46.905, lng: 18.0556 },
  Kazincbarcika: { lat: 48.25, lng: 20.6333 },
  Szentes: { lat: 46.65, lng: 20.2667 },
  Gödöllő: { lat: 47.5992, lng: 19.3658 },
  Budaörs: { lat: 47.4611, lng: 18.9556 },
  Dunakeszi: { lat: 47.6383, lng: 19.1419 },
  Szigetszentmiklós: { lat: 47.3469, lng: 19.0406 },
  Vecsés: { lat: 47.4089, lng: 19.2811 },
  Nagyatád: { lat: 46.2333, lng: 17.35 },
  Hatvan: { lat: 47.6667, lng: 19.6833 },
  Jászberény: { lat: 47.5, lng: 19.9167 },
  Ózd: { lat: 48.2167, lng: 20.2833 },
  Ajka: { lat: 47.1, lng: 17.5667 },
  Gyöngyös: { lat: 47.7833, lng: 19.9333 },
  Szentendre: { lat: 47.6667, lng: 19.0667 },
  Monor: { lat: 47.35, lng: 19.45 },
  Dabas: { lat: 47.1833, lng: 19.3167 },
  Mezőkövesd: { lat: 47.8167, lng: 20.5833 },
  Kiskunhalas: { lat: 46.4333, lng: 19.4833 },
  Mátészalka: { lat: 47.95, lng: 22.3333 },
  Sárvár: { lat: 47.25, lng: 16.9333 },
  Dombóvár: { lat: 46.3833, lng: 18.1333 },
  Balassagyarmat: { lat: 48.0833, lng: 19.3 },
  Tapolca: { lat: 46.8833, lng: 17.4333 },
  Paks: { lat: 46.6167, lng: 18.85 },
};

/**
 * Get coordinates for a Hungarian city
 * @param city City name
 * @returns Coordinates or null if not found
 */
export function getCityCoordinates(
  city: string,
): { lat: number; lng: number } | null {
  // Normalize city name (remove accents, lowercase, trim)
  const normalized = city.trim();

  // Try exact match first
  if (hungarianCities[normalized]) {
    return hungarianCities[normalized];
  }

  // Try case-insensitive match
  const cityKey = Object.keys(hungarianCities).find(
    (key) => key.toLowerCase() === normalized.toLowerCase(),
  );

  if (cityKey) {
    return hungarianCities[cityKey];
  }

  return null;
}
