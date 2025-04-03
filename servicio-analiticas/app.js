const express = require('express');
const app = express();
app.use(express.json());

const registros = {};

app.post('/reporte', (req, res) => {
  const serviceId = req.headers['x-service-id'];
  
  if (!serviceId) {
    return res.status(400).send('Falta X-Service-ID header');
  }

  registros[serviceId] = (registros[serviceId] || 0) + 1;
  
  console.log(`Registro recibido de ${serviceId}. Total: ${registros[serviceId]}`);
  res.json({ 
    servicio: serviceId,
    registros: registros[serviceId],
    timestamp: new Date().toISOString()
  });
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-Service-ID');
  next();
});

// Modifica la ruta /registro/estado
app.get('/reporte/estado', (req, res) => {
  // Verifica autenticación básica
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Autenticación requerida' });
  }
  
  res.json({
    totalRegistros: Object.values(registros).reduce((a, b) => a + b, 0),
    servicios: registros,
    fecha: new Date().toISOString()
  });
});

app.listen(3000, () => {
  console.log('API Registro escuchando en puerto 3000');
});
