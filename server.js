const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
//API
const cors = require('cors');
const bodyParser = require('body-parser');
var express = require('express') //llamamos a Express
var app = express()       
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
var port = process.env.PORT || 6600// establecemos nuestro puerto
//API
// Guarda la session para no volver a pedir el QR
const client = new Client({
    authStrategy: new LocalAuth(),
	puppeteer: {
		args: ['--no-sandbox'],
	}
});
//Inicia el cliente 
client.initialize();
//Si no esta logeado manda a imprimir el QR
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

//Ejecuta una funcion una vez este logeado 
client.on('authenticated', (session) => {  
	console.log('Autenticado Correctamente');
});
//Manda un error si la autenticación no funciono
client.on('auth_failure', msg => {
    console.error('No se pudo autenticar. ', msg);
});
//Manda una alerta de desconexion del cliente
client.on('disconnected', (reason) => {
    console.log('El cliente se desconecto ', reason);
});

//Si llega un mensaje lo muestra en el terminal 
client.on('message', message => {
	console.log(message.body);
});

//Ejecuta algo cuando el cliente esta preparado
client.on('ready', () => {  
	const chatId = '+573027490686'.substring(1) + "@c.us";
	const text = "Servidor levantado";
	client.sendMessage(chatId, text);
	listenMessage();	
});

//Lee todos los mensajes entrantes
const listenMessage = () => {
	client.on('message', (msg) => {
		const {from, to, body} = msg;
		console.log(from, to, body);
		//sendMessage(from, 'Respuesta de prueba')
	});
}

const sendMessage = (to, message) => {
	client.sendMessage(to, message);
}

///////////////API/////////////////
const enviarMensaje = (req, res) => {
	const { message, to } = req.body;
	const newNumber = `${to}@c.us`;
	sendMessage(newNumber, message);
	console.log(message, to);
	res.send({status: 'Enviado'});
}

app.post('/send', enviarMensaje);

//Envia el mensaje
//////////////API//////////////////
   
//API LISTENER
// iniciamos nuestro servidor
app.listen(port)
console.log('API escuchando en el puerto ' + port)




