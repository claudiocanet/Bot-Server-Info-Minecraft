const winston = require('winston');
const moment = require('moment');
const config = require('../core/config');

// Moment.js
const now = moment().format('HH:mm:SS');
const nowday = moment().format('YYYY-MM-DD');

module.exports = (client) => {
// Logger
	client.logger = winston.createLogger({
		transports: [
			new winston.transports.Console(),
			new winston.transports.File({ filename: `./logs/errors/${nowday}_error.log`, level: 'error' }),
			new winston.transports.File({ filename: `./logs/common/${nowday}.log` }),
		],
		format: winston.format.combine(
			winston.format.colorize(),
			winston.format.simple(),
			winston.format.printf(log => `[${now}] ${log.level}: ${log.message}`),
		),
	});
	// Logger propio para discord
	client.discordlog = (level, msg) => {

		if (level === 'error') {
			client.users.get(config.loggy.owner).send('Ha habido un error en **' + config.servername + '** el día *' + nowday + '* a las *' + now + '*\r `' + `[${level.toUpperCase()}] => ${msg}\``);
			client.channels.get(config.loggy.canal).send(`*[${level.toUpperCase()}]:* ${msg}`);
		}
		else if (level === 'new') {
			client.channels.get(config.loggy.canal).send(`**:white_check_mark:-------------- Consola Iniciada --------------:white_check_mark:**`);
		} else if (level === 'off') {
			client.channels.get(config.loggy.canal).send(`**:octagonal_sign:-------------- Consola Apagada --------------:octagonal_sign:**`);
		} else {
			client.channels.get(config.loggy.canal).send(`*[${level.toUpperCase()}]:* ${msg}`);
		}
	};
	client.loggy = async (canal, level, msg) => {
		/*
		* canal = 0, solo discord
		* canal = 1, solo consola
		* canal = 2, ambos*/
		if (canal === 0 || canal === 2) {
			client.discordlog(level, msg);
		}
		if (canal === 1 || canal === 2) {
			client.logger.log(level, msg);
		}
	};
};