require("dotenv").config()
const express = require("express");
const app = express();
const port = process.env.PORT;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("Conexión exitosa con la BD!!");
}).catch((err) => {
    console.log("Hubo un error al conectarnos a la BD", err);
});

const taskSchema = new Schema({
    name: String,
    done: Boolean,
    // createdBy: 
});

// si no se da el argumento de coleccion, mongoose automaticamente
// toma el nombre del modelo (Task) y lo pluraliza (tasks) en minusculas
const Task = mongoose.model("Task", taskSchema, "Tasks");

// los middlewares sirven para preprocesamiento,
// por eso es importante que estén antes de cada ruta, 
// porque si no, no van a ejecutarse antes y por lo antes no van a preprocesar

// los middlewares tambien se pueden pasar de la siguiente forma para una funcion en especifico:
/*
app.get("/prueba", middleware1, middleware2, ..., (req, res) => {
    ...
})
*/

// servir archivos estáticos
// middleware de archivos estáticos
app.use(express.static("public"));

// Middleware para parsear el BODY de las requests
// esto es porque por defecto, el body de las requests vienen en 
// pedacitos (chunk) y se tendría que implementar manualmente un
// middleware que vaya juntando todos esos pedazos,
// pero este middleware ya lo hace
app.use(express.json());

// A) Pasamos una función anónima
app.use((req, res, next) => {
    console.log("No especificamos como debe ser el inicio de la ruta");
    console.log("Middleware 1");
    next();
});


const logger = {
    logThis: (whatToLog) => {
        return (req, res, next) => {
            console.log("Middleware 2: ", whatToLog);
            next();
        }
    }
};

// para simular app.use(express.static("public"));
// donde express.static("public") regresa una funcion
app.use("/luis", logger.logThis("Logueame estooo"));

// configurar rutas
app.get("/api/tasks", function (req, res) {
    Task.find().then((tasks) => {
        res.status(200).json({ ok: true, data: tasks });
    }).catch((err) => {
        res.status(400).json({ ok: true, message: "Hubo un problema al obtener las tareas" });
    });
});

// Middleware para parsear BODY de la REQUEST (es como el caso "C")
app.post("/api/tasks", function (req, res) {
    const body = req.body;
    console.log({ body });
    // la tercera propiedad no se va a agregar porque no está en el schema
    Task.create({
        name: body.text,
        done: false,
        hello: "xd"
    }).then((createdTask) => {
        res.status(201).json({ ok: true, message: "Tarea creada con éxito", data: createdTask });
    }).catch((err) => {
        res.status(400).json({ ok: false, message: "Error al crear la tarea"});
    });
});

app.put("/api/tasks/:id", function (req, res) {
    const id = req.params.id;
    const body = req.body;
    console.log({ body });
    Task.findByIdAndUpdate(id, {
        name: body.text
    }).then((updatedTask) => {
        res.status(200).json({ ok: true, message: "Tarea actualizada con éxito", data: updatedTask });
    }).catch((err) => {
        res.status(400).json({ ok: false, message: "Error al actualizar la tarea"});
    });
});

app.delete("/api/tasks/:id", function (req, res) {
    // la id que se recibe en la ruta dinamica
    const id = req.params.id;
    // console.log({ params: req.params });
    Task.findByIdAndRemove(id).then((deletedTask) => {
        res.status(200).json({ ok: true, data: deletedTask });
    }).catch((err) => {
        res.status(400).json({ ok: false, message: `Hubo un error al eliminar la tarea: ${err}`});
    });
});


app.get("/users", (req, res) => {
    res.send([{name: "Martin"}, {name: "Francisco"}]);
});

// poner a escuchar la app en un puerto
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});