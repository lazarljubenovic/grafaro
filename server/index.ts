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
const server = require('http').createServer();
const url = require('url');
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({server: server});
const express = require('express');
const app = express();
const port = 4000;
const util = require('util');

app.use(function (req, res) {
    res.send({msg: "hello"});
});

wss.on('connection', ws => {
    let location = url.parse(ws.upgradeReq.url, true);
    // you might use location.query.access_token to authenticate or share sessions
    // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
    console.log(location);

    ws.on('message', message => {
        console.log(util.inspect(JSON.parse(message), false, null));
    });

    ws.on('error', (error) => {
        console.log(error);
    });

    ws.on('close', () => {
        //console.log(ws.address);
    });

    ws.send(JSON.stringify({
        payload: {
            timeStamp: new Date(),
            senderHandle: `lazarljubenovic`,
            senderName: `Lazar Ljubenović`,
            senderHash: `ff8adece0631821959f443c9d956fc39`,
            message: `Ohaio!`
        },
        type: 'chat'
    }))
});

server.on('request', app);
server.listen(port, () => {
    console.log('Listening on ' + server.address().port);
});
