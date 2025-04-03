const express = require('express');
const axios = require('axios');
const app = express();
const serviceId = process.env.SERVICE_ID || 'unknown';

// Configuración de la API de registro
const REGISTRY_API = 'http://servicio-analiticas:3000/reporte';
const AUTH = { username: 'admin', password: 'secret' };

// Hacer peticiones periódicas al registro
setInterval(async () => {
  try {
    const response = await axios.post(REGISTRY_API, {}, {
      auth: AUTH,
      headers: { 'X-Service-ID': serviceId }
    });
    console.log(`[${serviceId}] Registro exitoso:`, response.data);
  } catch (error) {
    console.error(`[${serviceId}] Error en registro:`, error.message);
  }
}, 5000); // Cada 5 segundos

app.get('/', (req, res) => {
  // Registrar este acceso
  axios.post('http://servicio-analiticas:3000/reporte', {}, {
    auth: { username: 'admin', password: 'secret' },
    headers: { 'X-Service-ID': serviceId }
  }).catch(e => console.error("Error registrando acceso:", e.message));

  res.send(`Cliente App - Instancia ${serviceId} | Registrado`);
});

app.listen(3001, () => {
  console.log(`Cliente ${serviceId} escuchando en puerto 3001`);
});
