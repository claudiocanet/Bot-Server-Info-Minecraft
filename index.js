// Detectar versión node (>8.0.0)
console.log('\033[2J');
if (Number(process.version.slice(1).split('.')[0]) < 8) throw new Error('Node 8.0.0 o mayor es necesario. Actualiza Node en tu sistema.');

// Dependencias
const Discord = require('discord.js');
const cliente = new Discord.Client();
const config = require('./core/config.json');

// Definir config
cliente.config = config;

// Librerias - Módulos
require('./modulos/logger.js')(cliente);
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const fs = require('fs');

// Cargar Bot
cliente.once('ready', () =>{
	cliente.loggy(0,'new');
	cliente.loggy(2, 'info', 'Bot iniciado');

	// Cargamos la libreria mysql despues de cargar el bot para que se improte correctamente loggy.
	require('./modulos/mysql')(cliente);

	// Indicamos el estado de taquitos
	cliente.user.setPresence({
		status: 'online',
		game: {
			name: 'Peppa Pig - Temporada 1',
			type: 'WATCHING' },
	});

	const sql = 'INSERT INTO log_bot (type, action, message) VALUES ("bot", "start_server", \'{"console": "[Bot] - Online", "msg": "Bot iniciado correctamente."}\')';
	cliente.con.query(sql, function(err) {
		if (err) {
			console.error(colors.red('[MySQL] - '), 'Error al insertar la fila: ', err.stack);
		}
	});
});

// Reconectar bot
cliente.once('reconnecting', () => {
	cliente.user.setPresence({
		status: 'dnd',
		game: {
			name: 'La liga del Lag',
			type: 'PLAYING' },
	});
	const sql = 'INSERT INTO log_bot (type, action, message) VALUES ("bot", "restart_server", \'{"console": "[Bot] - Reconectando...", "msg": "El bot ha perdido la conexión y se está reconectando."}\')';
	cliente.con.query(sql, function(err) {
		if (err) {
			console.error(colors.red('[MySQL] - '), 'Error al insertar la fila: ', err.stack);
		}
	});
});

// Bot desconectado
cliente.once('disconnect', () => {
	cliente.loggy(2, 'info', 'Bot apagado');
	cliente.loggy(0, 'off');
});

const init = async () => {
	if (!fs.existsSync('./eventos')){
		fs.mkdirSync('./eventos');
	}
	if (!fs.existsSync('./comandos')){
		fs.mkdirSync('./comandos');
	}
	const evtFiles = await readdir('./eventos/');
	cliente.loggy(1, 'info', `Cargando un total de ${evtFiles.length} de eventos`);
	evtFiles.forEach(file => {
		const eventoname = file.split('.')[0];
		cliente.loggy(1, 'info', `Cargando evento: ${eventoname}`);
		const evento = require(`./eventos/${file}`);
		cliente.on(eventoname, evento.bind(null, cliente));
	});

	cliente.on('message', (message) => {
		if (!message.content.startsWith(cliente.config.prefix) || message.author.bot) return;
		const args = message.content.slice(cliente.config.prefix.length).trim().split(/ +/g);
		const comando = args.shift().toLowerCase();
		try {
			const cmdFile = require(`./comandos/${comando}.js`);
			cmdFile.run(cliente, message, args);
			cliente.loggy(2, 'info', `Comando ${comando} ejecutado con exito por ${message.author.tag}`);
		}
		catch (err) {
			cliente.loggy(2, 'warn', `Comando ${comando} no existe. Ejecutado por ${message.author.tag}`);
			message.channel.send(
				{ embed:
						{ color: 0xfb5e62,
							description: 'El comando **' + comando + '** no existe' } });
		}
	});

	cliente.login(cliente.config.discord_token);
};

init();