const fs = require('fs')
const path = require('path')

const inputFolder = path.join(__dirname, '../../mexico-geojson')
const outputFile = path.join(__dirname, '../frontend/src/lib/mexicoStates.geojson')

// Mapea código → nombre real
const stateNames = {
  '01-Ags.geojson': 'Aguascalientes',
  '02-Bc.geojson': 'Baja California',
  '03-Bcs.geojson': 'Baja California Sur',
  '04-Camp.geojson': 'Campeche',
  '05-Coah.geojson': 'Coahuila',
  '06-Col.geojson': 'Colima',
  '07-Chis.geojson': 'Chiapas',
  '08-Chih.geojson': 'Chihuahua',
  '09-Cdmx.geojson': 'Ciudad de México',
  '10-Dgo.geojson': 'Durango',
  '11-Gto.geojson': 'Guanajuato',
  '12-Gro.geojson': 'Guerrero',
  '13-Hgo.geojson': 'Hidalgo',
  '14-Jal.geojson': 'Jalisco',
  '15-Mex.geojson': 'Estado de México',
  '16-Mich.geojson': 'Michoacán',
  '17-Mor.geojson': 'Morelos',
  '18-Nay.geojson': 'Nayarit',
  '19-NL.geojson': 'Nuevo León',
  '20-Oax.geojson': 'Oaxaca',
  '21-Pue.geojson': 'Puebla',
  '22-Qro.geojson': 'Querétaro',
  '23-Qroo.geojson': 'Quintana Roo',
  '24-SLP.geojson': 'San Luis Potosí',
  '25-Sin.geojson': 'Sinaloa',
  '26-Son.geojson': 'Sonora',
  '27-Tab.geojson': 'Tabasco',
  '28-Tmps.geojson': 'Tamaulipas',
  '29-Tlax.geojson': 'Tlaxcala',
  '30-Ver.geojson': 'Veracruz',
  '31-Yuc.geojson': 'Yucatán',
  '32-Zac.geojson': 'Zacatecas'
}

let combinedFeatures = []

Object.keys(stateNames).forEach(fileName => {
  const filePath = path.join(inputFolder, fileName)

  if (!fs.existsSync(filePath)) {
    console.log(`⚠ Archivo no encontrado: ${fileName}`)
    return
  }

  const geojson = JSON.parse(fs.readFileSync(filePath, 'utf8'))

  geojson.features.forEach(feature => {
    feature.properties = {
      ...feature.properties,
      state: stateNames[fileName]
    }

    combinedFeatures.push(feature)
  })
})

const finalGeoJSON = {
  type: 'FeatureCollection',
  features: combinedFeatures
}

fs.writeFileSync(outputFile, JSON.stringify(finalGeoJSON))

console.log('✅ mexicoStates.geojson generado correctamente')