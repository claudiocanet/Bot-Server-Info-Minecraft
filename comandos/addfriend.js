exports.run = (client, message, args) => {
	const user = args[0];

	if (message.channel.type !== 'dm') {
		message.channel.send(
			{ embed:
					{ color: 0xfb5e62,
						description: 'El comando solo puede ejecutarse en DM.' } });
		return;
	} else {
		if (message.author.id !== client.config.loggy.owner) {
			message.channel.send(
				{ embed:
						{ color: 0xfb5e62,
							description: 'El comando solo puede ejecutarse por un administrador.' } });
			return;
		}
	}
	message.channel.send({embed: {
			color: 3447003,
			title: "Agregar amigos",
			description: `¿Quieres agregar a ${user} como amigos de Taquitos?`,
			footer:
				{
					text: "TaquiBot ©"
				}
		}}).then(function (message) {
			message.react("👍").then(() => message.react("👎"));

			const filter = (reaction, user) => {
				return ['👍','👎'].includes(reaction.emoji.name) && user.id === message.author.id;
			};

			message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time']})
				.then(collected => {
					const reaction = collected.first();
					console.log(user);
					if (reaction.emoji.name === '👍') {
						const userid = client.guilds.members.find(m => m.user.username === user).user.id;

						client.channel.get(userid).send('Puta cerda');
					} else {

					}
				});
		}).catch(function() {
		//Something
	});
};