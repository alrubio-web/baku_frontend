const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');

const app = express();

// Sirve los archivos estáticos de la carpeta dist
app.use(serveStatic(path.join(__dirname, 'dist')));

// Captura todas las rutas y redirige a la aplicación
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 80;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
