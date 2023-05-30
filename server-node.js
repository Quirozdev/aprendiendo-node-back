require("dotenv").config();
const http = require("http");
const fs = require("fs");

function requestController(req, res) {
    const url = req.url;
    const method = req.method;
    console.log({ url, method });

    if (method === "GET" && url === "/") {
        // en este caso no es necesario poner:
        // ; charset=utf-8
        // porque en la etiqueta meta de ese html
        // ya se pone que sea ese charset
        res.setHeader("Content-type", "text/html");
        fs.readFile("./public/index.html", function(err, file) {
            if (err) {
                console.log("Hubo un error!!!");
            }
            res.write(file);
            res.end();
        });
        return;
    }

    if (method === "GET" && url === "/about") {
        res.setHeader("Content-type", "text/html; charset=utf-8");
        res.write("<h1>Hola mundo desde la página ABOUT!!!</h1>");
        res.end();
        return;
    }

    res.setHeader("Content-type", "text/html; charset=utf-8");
    res.statusCode = 404;
    res.write("<h1>Página no encontrada 😎</h1>");
    res.end();   
}

// en mi maquina sera el 4000 que tengo en el archivo .env, 
// pero en produccion, va a ser el que el proveedor quiera
const PORT = process.env.PORT;

// Configurar nuestro servidor
const server = http.createServer(requestController);

server.listen(process.env.PORT, function() {
    console.log("Aplicación corriendo en puerto: " + PORT);
});