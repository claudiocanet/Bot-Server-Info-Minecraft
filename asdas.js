const config = require("../config/config.json");
const idcanal = require("../config/servers.json");
exports.run = (cliente, message, args) => {
	if (message.channel.id == '617058008643665920'){
		var alcance = args[0].toLowerCase();
		var servidores = args[1].split(",");
		var mensaje = args.slice(2).join(" ");
		var defmensaje;

		var serv = {
			fivem: idcanal.fivem,
			skyblock: idcanal.skyblock,
			unturned: idcanal.unturned,
			community: idcanal.main,
			roleplay: idcanal.roleplay
		};

		if (alcance == "ninguno"){
			defmensaje = "**"+ message.author.username + "** ha publicado un nuevo anuncio:\n"+
				"```xl\n"+
				mensaje +'\n'+
				"```";
		} else if (alcance == "here"){
			defmensaje = "@here \n"+
				"**"+ message.author.username + "** ha publicado un nuevo anuncio:\n"+
				"```xl\n"+
				mensaje + '\n'+
				"```";
		} else if (alcance == "everyone"){
			defmensaje = "@everyone \n"+
				"**"+ message.author.username + "** ha publicado un nuevo anuncio:\n"+
				"```xl\n"+
				mensaje + '\n'+
				"```";
		}
		if (alcance == "everyone" || alcance == "here" || alcance == "ninguno") {
			if (servidores.length <= 5) {
				const msgembed = {
					color: 0x0099ff,
					title: '¿Quieres publicar el anuncio?',
					author: {
						name: message.author.username,
						icon_url: message.author.avatarURL
					},
					description: 'Pulsa ✅ para publicar el anuncio en **TODOS** los servidores de discord o ❎para cancelar',
					fields: [
						{
							name: 'Alcance',
							value: alcance
						},
						{
							name: 'Servidores',
							value: args[1]
						},
						{
							name: 'Anuncio',
							value: mensaje
						}
					],
					timestamp: new Date(),
					footer: {
						text: '© 2019 IberiaLife',
					},
				};

				const msgenviado = {
					color: 0x0099ff,
					title: 'Anuncio enviado',
					author: {
						name: message.author.username,
						icon_url: message.author.avatarURL
					},
					description: 'El anuncio ha sido enviado correctamente a todos los servidores',
					fields: [
						{
							name: 'Alcance',
							value: alcance
						},
						{
							name: 'Servidores',
							value: args[1]
						},
						{
							name: 'Anuncio',
							value: mensaje
						}
					],
					timestamp: new Date(),
					footer: {
						text: '© 2019 IberiaLife',
					},
				};
				message.channel.send({ embed: msgembed}).then(msg => {
					msg.react('✅').then(r => {
						msg.react('❎')

						const filter = (reaction, user) => {
							return ['✅','❎'].includes(reaction.emoji.name) && user.id === message.author.id;
						};

						msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time']})
							.then(collected => {
								const reaction = collected.first();

								if (reaction.emoji.name === '✅'){
									msg.delete();
									message.channel.send({embed: msgenviado});
									for (var i=0; i < servidores.length; i++) {
										if (servidores[i] != ""){
											console.log(serv[servidores[i]]);
											cliente.channels.get(serv[servidores[i]]).send(defmensaje);
										}
									}

								} else {
									msg.delete();
									message.reply("has cancelado el comando");
								}
							})
							.catch(collected => {
								message.delete();
								message.reply("Comando expirado.");
							});
					});
				});
			} else {
				message.delete();
				message.reply("No puedes tener más de 5 servidores.");
			}
		} else {
			message.delete();
			message.reply("Elige un alcance valido").then(msg => {
				msg.delete(10000);
			});
		}
	}
}