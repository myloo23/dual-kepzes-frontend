import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Saját default ikon beállítása a public/leaflet mappából
const defaultIcon = L.icon({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;


type CompanyOnMap = {
  id: number;
  name: string;
  industry: string;
  city: string;
  addressLine: string;
  latitude: number;
  longitude: number;
  activePositionsCount: number;
};

const mockCompanies: CompanyOnMap[] = [
  {
    id: 1,
    name: "DHBW mintaprojekt Kft.",
    industry: "Informatika",
    city: "Budapest",
    addressLine: "1111 Budapest, Minta utca 1.",
    latitude: 47.4814,
    longitude: 19.0551,
    activePositionsCount: 2,
  },
  {
    id: 2,
    name: "Business IT Solutions Zrt.",
    industry: "Informatika / üzlet",
    city: "Győr",
    addressLine: "9022 Győr, Fő tér 3.",
    latitude: 47.6875,
    longitude: 17.6504,
    activePositionsCount: 1,
  },
  {
    id: 3,
    name: "CloudWorks Hungary",
    industry: "IT üzemeltetés",
    city: "Szeged",
    addressLine: "6720 Szeged, Kárász utca 10.",
    latitude: 46.252,
    longitude: 20.1414,
    activePositionsCount: 1,
  },
  {
    id: 4,
    name: "DataBridge Kft.",
    industry: "Adattudomány",
    city: "Budapest",
    addressLine: "1132 Budapest, Duna sor 5.",
    latitude: 47.5189,
    longitude: 19.056,
    activePositionsCount: 1,
  },
  {
    id: 5,
    name: "NextGen Software Kft.",
    industry: "Szoftverfejlesztés",
    city: "Kecskemét",
    addressLine: "6000 Kecskemét, Fő utca 12.",
    latitude: 46.9062,
    longitude: 19.6913,
    activePositionsCount: 1,
  },
];

function MapPage() {
  // ha később backendről jön az adat, ide jön majd a fetch helyette
  const companies = useMemo(() => mockCompanies, []);

  const defaultCenter: [number, number] = [47.1, 19.5]; // Magyarország közepe

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">
          Cégek térképes megjelenítése
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Itt láthatod, hogy a duális képzésben részt vevő cégek
          földrajzilag hol helyezkednek el. A jelölőre kattintva
          megjelenik a cég neve, iparága, címe és az elérhető pozíciók száma.
        </p>
      </header>

      <div className="h-[500px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <MapContainer
          center={defaultCenter}
          zoom={7}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> közreműködők'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {companies.map((c) => (
            <Marker
              key={c.id}
              position={[c.latitude, c.longitude]}
            >
              <Popup>
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-slate-900">
                    {c.name}
                  </div>
                  <div className="text-slate-600">{c.industry}</div>
                  <div className="text-slate-500">
                    {c.addressLine} ({c.city})
                  </div>
                  <div className="text-slate-500">
                    Aktív pozíciók:{" "}
                    <span className="font-medium text-slate-900">
                      {c.activePositionsCount}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapPage;
