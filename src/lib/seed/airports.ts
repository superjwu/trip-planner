/**
 * Map of destination slug → nearest airport IATA used for flight quotes
 * (Amadeus + Skyscanner deep-links) and the city code used by Amadeus hotel
 * search. Keep this alongside the seed; if a slug is missing here, the rec
 * gracefully falls back to estimated cost bands.
 */
export interface AirportMapping {
  airportIata: string; // closest commercial airport
  hotelCityCode?: string; // Amadeus city code (often the same as airportIata)
}

export const DESTINATION_AIRPORTS: Record<string, AirportMapping> = {
  // Cities
  "boston-ma":      { airportIata: "BOS", hotelCityCode: "BOS" },
  "charleston-sc":  { airportIata: "CHS", hotelCityCode: "CHS" },
  "savannah-ga":    { airportIata: "SAV", hotelCityCode: "SAV" },
  "new-orleans-la": { airportIata: "MSY", hotelCityCode: "MSY" },
  "nashville-tn":   { airportIata: "BNA", hotelCityCode: "BNA" },
  "austin-tx":      { airportIata: "AUS", hotelCityCode: "AUS" },
  "asheville-nc":   { airportIata: "AVL", hotelCityCode: "AVL" },
  "santa-fe-nm":    { airportIata: "SAF", hotelCityCode: "SAF" },
  "san-diego-ca":   { airportIata: "SAN", hotelCityCode: "SAN" },

  // Parks (use closest commercial airport)
  "acadia-np":          { airportIata: "BGR", hotelCityCode: "BGR" },
  "yellowstone-np":     { airportIata: "BZN", hotelCityCode: "BZN" },
  "yosemite-np":        { airportIata: "FAT", hotelCityCode: "FAT" },
  "zion-np":            { airportIata: "LAS", hotelCityCode: "LAS" },
  "joshua-tree-np":     { airportIata: "PSP", hotelCityCode: "PSP" },
  "smoky-mountains-np": { airportIata: "TYS", hotelCityCode: "TYS" },
  "glacier-np":         { airportIata: "FCA", hotelCityCode: "FCA" },
  "olympic-np":         { airportIata: "SEA", hotelCityCode: "SEA" },

  // Mountain / small towns
  "aspen-co":         { airportIata: "ASE", hotelCityCode: "ASE" },
  "jackson-hole-wy":  { airportIata: "JAC", hotelCityCode: "JAC" },
  "sedona-az":        { airportIata: "FLG", hotelCityCode: "FLG" },
  "big-sur-ca":       { airportIata: "MRY", hotelCityCode: "MRY" },

  // Mixed
  "maui-hi":         { airportIata: "OGG", hotelCityCode: "OGG" },
  "kauai-hi":        { airportIata: "LIH", hotelCityCode: "LIH" },
  "key-west-fl":     { airportIata: "EYW", hotelCityCode: "EYW" },
  "hudson-valley-ny":{ airportIata: "SWF", hotelCityCode: "SWF" },
  "cape-cod-ma":     { airportIata: "BOS", hotelCityCode: "HYA" }, // Hyannis hotel city
};
