const mysql = require('mysql');
const config = require('../core/config.json');


module.exports = (cliente) => {
	require('../modulos/logger')(cliente);
	// Cargar mysql
	cliente.con = mysql.createConnection({
		host: config.mysql.host,
		user: config.mysql.user,
		password: config.mysql.pass,
		database: config.mysql.db,
	});

	// Validar conexión MySQL
	cliente.con.connect(function(err) {
		if (err) {
			cliente.loggy(2, 'error', `Error al iniciar la base de datos. Error: ${err}`);
			return;
		}
		cliente.loggy(2, 'info', 'Base de datos conectada');

	});

	// Errores
};