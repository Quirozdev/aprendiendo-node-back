const http = require("http");
const exportsFromAnother = require("./another");

// console.log({ exportsFromAnother });
console.log({ http });

const companies = [
    {name: "TuTurno", isOnline: true},
    {name: "Spa Relax", isOnline: false}
];

function requestController() {
    console.log({ dir: __dirname });
}

// Configurar nuestro servidor
const server = http.createServer(requestController);

server.listen(4000);