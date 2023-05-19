require("dotenv").config();
const http = require("http");
// const exportsFromAnother = require("./another");

// console.log({ exportsFromAnother });
// console.log({ http });

const companies = [
    {name: "TuTurno", isOnline: true},
    {name: "Spa Relax", isOnline: false}
];

function requestController() {
    console.log({ dir: __dirname }, "xd");
}

// en mi maquina sera el 4000 que tengo en el archivo .env, 
// pero en produccion, va a ser el que el proveedor quiera
const PORT = process.env.PORT;

// Configurar nuestro servidor
const server = http.createServer(requestController);

server.listen(process.env.PORT, function() {
    console.log("Aplicación corriendo en puerto: " + PORT);
});