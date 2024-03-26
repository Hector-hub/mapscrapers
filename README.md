# Mapscrapers Docs

<img src="https://hecrey.000webhostapp.com/public/img/projects/mapscrapers.png" width="350" height="350" alt="Mapscrapers Logo">

## Descripción
Mapscrapers es una API diseñada para recopilar datos de rutas de Google Maps con el fin de identificar los momentos óptimos para transitar dichas rutas.

## Dominio
`https://mapscrapers.onrender.com/`

## Parámetros
- `url` - La URL de la ruta de Google Maps.
- `id` - Identificador único para obtener resultados asociados a una ruta específica.

## Endpoints
- `/makeRequest` - Para realizar una solicitud de recolección de datos.
- `/getResults` - Para obtener resultados de la solicitud realizada.
- `/getAllRequestsResults` - Para obtener todos los resultados de las solicitudes realizadas.

## Ejemplo de Uso

### `/makeRequest`
Realizar una solicitud:
```javascript
fetch('/makeRequest?url=https://www.google.com/maps/dir/La+Romana/Boca+Chica/@18.450333,-69.4262336,11z/data=!4m14!4m13!1m5!1m1!1s0x8eaf5468f250cc2b:0x174be55fc8eb99d9!2m2!1d-68.9658817!2d18.4338645!1m5!1m1!1s0x8eaf7e4f2d66d645:0xcc38335d1eba7e73!2m2!1d-69.6082811!2d18.4547535!3e0?entry=ttu', {
  method: 'GET'
})
.then(response => response.text())
.then(data => console.log(data));
```
Respuesta:
```javascript
{
  "requestId": "la-romana_boca-chica"
}
```
### `/getResults`
Obtener resultados:
```javascript
fetch('/getResults?id=la-romana_boca-chica', {
  method: 'GET'
})
.then(response => response.json())
.then(data => console.log(data));
```
Respuesta:
```javascript
[
  {
    "date": "3/23/2024, 9:46:03 AM",
    "options": [ 6, 9, 9 ],
    "optionsTimeType": "minutes"
  }
]
```
### `/getAllRequestsResults`
Obtener resultados:
```javascript
fetch('/getAllRequestsResults', {
  method: 'GET'
})
.then(response => response.json())
.then(data => console.log(data));
```
Respuesta:
```javascript
{
  "la-romana_boca-chica": [
    {
      "date": "3/25/2024, 5:06:44 AM",
      "options": [ 40 ],
      "optionsTimeType": "minutes"
    }
  ],
  "santo-domingo_bani": [
    {
      "date": "3/25/2024, 5:06:58 AM",
      "options": [ 59 ],
      "optionsTimeType": "minutes"
    }
  ]
}
```
&copy; 2024 Mapscrapers

Powered by [hecrey](https://hecrey.000webhostapp.com)
