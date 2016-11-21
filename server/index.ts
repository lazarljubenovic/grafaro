const express = require('express');
const app = express();
const webSocketServer = require('ws').Server;
const wsServer = new webSocketServer({port: 8080});

/*
Ideja (jer me EasyFind ubio psihicki): https://github.com/websockets/ws#sending-and-receiving-text-data
Cuvamo 2D niz konekcija i kada se klijent konektuje, prosledimo, na osnovu URL-a ili neceg slicnog,
neki hash ili sta vec. Potrazimo u matrici da li postoji vec otvorena konecija sa tim hashom ili ne.
Ako postoji, samo ga dodamo u konekcije[hash], a ako ne, napravimo konekcije[hash] i dodamo ga.
Cao zdravo poz.
Posle toga "samo" iziteriramo taj niz da nadjemo tog klijenta kako bismo znali kojoj konekciji da prosledimo tu poruku.
Treba da vidim da li ima neka fora da svi klijenti imaju neko isto polje, pa da taj hash piggybackujemo.
 */

// wsServer.broadcast = (data) => {
// 	wsServer.clients.forEach((client) => {
// 		console.log(client);
// 		client.send(data);
// 	})
// };

wsServer.on('connection', (ws) => {
	ws.on('message', (message) => {
		// console.log("Evo je poruka", message);
		// ws.send(message);
		wsServer.clients.forEach((client) => {
			console.log(client);
			if (client != ws) {
				client.send(message);
			}
		})
	});
	ws.send('Connected');
});

app.get('/', (req, res) => {
	res.send("ojha");
});

app.listen(3000, () => {
	console.log("Server je na portu 3000");
});