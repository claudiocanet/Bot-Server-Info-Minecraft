const config = require('../core/config');
exports.run = (cliente, message, args) => {
    function intervalFunc() {
        message.channel.fetchMessages({around: "698585958567772290", limit: 1})
            .then(messages => {
                var request = require("request");
                var url = "https://api.minetools.eu/ping/" + config.sv.taquitos.ip + "/" + config.sv.taquitos.port;
                    request({
                        url: url,
                        json: true,
                    }, function(error, response, body){
                            if (body.error && body.error === "[Errno 111] Connection refused") {
                            var color = "diff";
                            var estado = "- Servidor Offline";
                            var estadolite = "```"+ color + '\n' + estado + "```";

                            messages.first().edit(" ►►Servidor◄◄ ``` Jugadores Online: Server Offline ```" + '\n' + "**Estado:**" + estadolite);
                        } else {
                                    var color = "css";
                                    var estado = "Servidor ON";
                                    var estadolite = "```" + color + '\n' + estado + "```";
                                    if (body.players.online == 0) {
                                        messages.first().edit(" ►►" + body.description + "◄◄ ``` Jugadores Online: 0 / " + body.players.max + "```" + '\n' + "Lista de Jugadores: " + "``` No hay jugadores conectados ```" + '\n' + "**Estado:**" + estadolite);
                                    } else {
                                        //var jsonfile = body.players.sample;
                                        var s = '';
                                        var a = '';
                                        var i = 0;
                                        var col = 3;
                                        while (body.players.sample[i]) {
                                            if (i % col == 0) {
                                                s += '\n' + " ► " + body.players.sample[i].name;
                                            } else {
                                                s += '\t' + " ► " + body.players.sample[i].name;
                                            }
                                            i++;
                                        }
                                        messages.first().edit(" ►►"+ body.description +"◄◄ *Versión: "+ body.version.name +"* ``` Jugadores Online: " + body.players.online + " / " + body.players.max + "```" +'\n' + "Lista de Jugadores: " + "``` " + s + " ```" + '\n' + "**Estado:**" + estadolite + '\n' + "**IP: **" + config.sv.taquitos.ip + ":" + config.sv.taquitos.port + '\t' + "**PING: **" + body.latency);
                                    }
                            /*var color = "css";
                            var estado = "Servidor ON";
                            var estadolite = "```"+ color + '\n' + estado + "```";
                            if (body.error == 0) {
                                messages.first().edit(" ►►" + config.servername + "◄◄ ``` Jugadores Online: " + body.players.online + " / " + body.players.max + "```" +'\n' + "Lista de Jugadores: " + "``` ```" + '\n' + "**Estado:**" + estadolite);
                            } else{

                                }
                                //messages.first().edit("@here ►►Servidor◄◄ ```" + body.players.online + " / " + body.players.max + "```" +'\n' + "Lista de Jugadores: " + "``` " + s + " ```");
                                messages.first().edit(" ►►"+ config.servername +"◄◄ ``` Jugadores Online: " + body.players.online + " / " + body.players.max + "```" +'\n' + "Lista de Jugadores: " + "``` " + s + " ```" + '\n' + "**Estado:**" + estadolite);
                            }*/
                        }
                    });
            });
    }
    setInterval(intervalFunc, 1000);
}
