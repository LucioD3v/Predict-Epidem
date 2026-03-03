export const mexicoStatesGeoJSON = {
  "type": "FeatureCollection",
  "features": [
    { "type": "Feature", "properties": { "name": "Aguascalientes", "id": "AGU" }, "geometry": { "type": "Point", "coordinates": [-102.2916, 21.8853] }},
    { "type": "Feature", "properties": { "name": "Baja California", "id": "BCN" }, "geometry": { "type": "Point", "coordinates": [-115.4683, 30.8406] }},
    { "type": "Feature", "properties": { "name": "Baja California Sur", "id": "BCS" }, "geometry": { "type": "Point", "coordinates": [-111.6703, 26.0444] }},
    { "type": "Feature", "properties": { "name": "Campeche", "id": "CAM" }, "geometry": { "type": "Point", "coordinates": [-90.5349, 19.8301] }},
    { "type": "Feature", "properties": { "name": "Chiapas", "id": "CHP" }, "geometry": { "type": "Point", "coordinates": [-92.6376, 16.7569] }},
    { "type": "Feature", "properties": { "name": "Chihuahua", "id": "CHH" }, "geometry": { "type": "Point", "coordinates": [-106.0691, 28.6330] }},
    { "type": "Feature", "properties": { "name": "Coahuila", "id": "COA" }, "geometry": { "type": "Point", "coordinates": [-101.7068, 27.0587] }},
    { "type": "Feature", "properties": { "name": "Colima", "id": "COL" }, "geometry": { "type": "Point", "coordinates": [-103.7240, 19.2452] }},
    { "type": "Feature", "properties": { "name": "Ciudad de México", "id": "CMX" }, "geometry": { "type": "Point", "coordinates": [-99.1332, 19.4326] }},
    { "type": "Feature", "properties": { "name": "Durango", "id": "DUR" }, "geometry": { "type": "Point", "coordinates": [-104.6532, 24.0277] }},
    { "type": "Feature", "properties": { "name": "Guanajuato", "id": "GUA" }, "geometry": { "type": "Point", "coordinates": [-101.2574, 21.0190] }},
    { "type": "Feature", "properties": { "name": "Guerrero", "id": "GRO" }, "geometry": { "type": "Point", "coordinates": [-99.5451, 17.4392] }},
    { "type": "Feature", "properties": { "name": "Hidalgo", "id": "HID" }, "geometry": { "type": "Point", "coordinates": [-98.7624, 20.0911] }},
    { "type": "Feature", "properties": { "name": "Jalisco", "id": "JAL" }, "geometry": { "type": "Point", "coordinates": [-103.3494, 20.6597] }},
    { "type": "Feature", "properties": { "name": "México", "id": "MEX" }, "geometry": { "type": "Point", "coordinates": [-99.6710, 19.2926] }},
    { "type": "Feature", "properties": { "name": "Michoacán", "id": "MIC" }, "geometry": { "type": "Point", "coordinates": [-101.7068, 19.5665] }},
    { "type": "Feature", "properties": { "name": "Morelos", "id": "MOR" }, "geometry": { "type": "Point", "coordinates": [-99.2233, 18.6813] }},
    { "type": "Feature", "properties": { "name": "Nayarit", "id": "NAY" }, "geometry": { "type": "Point", "coordinates": [-104.8455, 21.7514] }},
    { "type": "Feature", "properties": { "name": "Nuevo León", "id": "NLE" }, "geometry": { "type": "Point", "coordinates": [-100.3161, 25.5922] }},
    { "type": "Feature", "properties": { "name": "Oaxaca", "id": "OAX" }, "geometry": { "type": "Point", "coordinates": [-96.7266, 17.0732] }},
    { "type": "Feature", "properties": { "name": "Puebla", "id": "PUE" }, "geometry": { "type": "Point", "coordinates": [-98.2063, 19.0414] }},
    { "type": "Feature", "properties": { "name": "Querétaro", "id": "QUE" }, "geometry": { "type": "Point", "coordinates": [-100.3899, 20.5888] }},
    { "type": "Feature", "properties": { "name": "Quintana Roo", "id": "ROO" }, "geometry": { "type": "Point", "coordinates": [-88.2963, 19.1817] }},
    { "type": "Feature", "properties": { "name": "San Luis Potosí", "id": "SLP" }, "geometry": { "type": "Point", "coordinates": [-100.9855, 22.1565] }},
    { "type": "Feature", "properties": { "name": "Sinaloa", "id": "SIN" }, "geometry": { "type": "Point", "coordinates": [-107.3940, 25.8000] }},
    { "type": "Feature", "properties": { "name": "Sonora", "id": "SON" }, "geometry": { "type": "Point", "coordinates": [-110.9559, 29.2972] }},
    { "type": "Feature", "properties": { "name": "Tabasco", "id": "TAB" }, "geometry": { "type": "Point", "coordinates": [-92.9475, 17.8409] }},
    { "type": "Feature", "properties": { "name": "Tamaulipas", "id": "TAM" }, "geometry": { "type": "Point", "coordinates": [-99.1013, 24.2669] }},
    { "type": "Feature", "properties": { "name": "Tlaxcala", "id": "TLA" }, "geometry": { "type": "Point", "coordinates": [-98.2375, 19.3139] }},
    { "type": "Feature", "properties": { "name": "Veracruz", "id": "VER" }, "geometry": { "type": "Point", "coordinates": [-96.1429, 19.1738] }},
    { "type": "Feature", "properties": { "name": "Yucatán", "id": "YUC" }, "geometry": { "type": "Point", "coordinates": [-89.5926, 20.7099] }},
    { "type": "Feature", "properties": { "name": "Zacatecas", "id": "ZAC" }, "geometry": { "type": "Point", "coordinates": [-102.5832, 22.7709] }}
  ]
};

export interface StateRiskData {
  state: string;
  cases: number;
  predicted: number;
  riskLevel: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRÍTICO';
  riskScore: number;
}

export const mockStateData: StateRiskData[] = [
  { state: "Veracruz", cases: 3104, predicted: 4630, riskLevel: "ALTO", riskScore: 0.85 },
  { state: "Quintana Roo", cases: 2450, predicted: 3200, riskLevel: "ALTO", riskScore: 0.78 },
  { state: "Yucatán", cases: 1890, predicted: 2100, riskLevel: "MEDIO", riskScore: 0.65 },
  { state: "Tabasco", cases: 1650, predicted: 1900, riskLevel: "MEDIO", riskScore: 0.62 },
  { state: "Campeche", cases: 980, predicted: 1200, riskLevel: "MEDIO", riskScore: 0.55 },
  { state: "Chiapas", cases: 1200, predicted: 1400, riskLevel: "MEDIO", riskScore: 0.58 },
  { state: "Oaxaca", cases: 890, predicted: 950, riskLevel: "BAJO", riskScore: 0.42 },
  { state: "Guerrero", cases: 750, predicted: 820, riskLevel: "BAJO", riskScore: 0.38 },
  { state: "Jalisco", cases: 1100, predicted: 1250, riskLevel: "MEDIO", riskScore: 0.52 },
  { state: "Ciudad de México", cases: 680, predicted: 720, riskLevel: "BAJO", riskScore: 0.35 },
];

export function getRiskColor(riskLevel: string): string {
  switch (riskLevel) {
    case 'CRÍTICO': return '#DC2626';
    case 'ALTO': return '#EF4444';
    case 'MEDIO': return '#F59E0B';
    case 'BAJO': return '#10B981';
    default: return '#6B7280';
  }
}
