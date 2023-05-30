console.log("Este JS va a ser interpretado por el NAVEGADOR");

// const button = document.querySelector("button");
// console.log({ button });
const createEditBtn = document.querySelector("#create-task");
const tasksContainer = document.querySelector("#tasks");
const input = document.querySelector("#task-name");

const baseBackendUrl = "http://localhost:4000/api";

let taskToEdit = null;

createEditBtn.addEventListener("click", function() {
    console.log("CREAR TAREA");
    // !null = true
    const creating = !taskToEdit;
    console.log({ input });
    // al servidor solo se le pueden pasar strings,
    // por eso el uso de stringify
    // "http://localhost:4000/api/tasks"
    const path = creating ? "tasks" : `tasks/${taskToEdit._id}`;
    const method = creating ? "POST" : "PUT";
    fetch(`${baseBackendUrl}/${path}`, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input.value })
    }).then((res) => {
        // console.log({ res });
        getTasks();
        input.value = "";
        createEditBtn.innerText = "Crear tarea";
        return res.json();
    }).then((resJSON) => {
        console.log({ resJSON });
    });
});


function getTasks() {
    // para resetearlo cada vez que se llame a esta función
    tasksContainer.innerHTML = null;
    fetch(`${baseBackendUrl}/tasks`).then((res) => {
        // console.log({ res });
        return res.json();
    }).then((resJSON) => {
        // console.log({ resJSON });
        const tasks = resJSON.data;
        for (const task of tasks) {
            const taskParagraph = document.createElement("p");
            const deleteTaskBtn = document.createElement("button");
            const taskContainerDiv = document.createElement("div");
            taskParagraph.innerText = task.name;
            deleteTaskBtn.innerText = "Borrar";
            deleteTaskBtn.setAttribute("id", task._id);
            deleteTaskBtn.addEventListener("click", (e) => {
                const taskId = e.target.id;
                deleteTaskBtn.innerText = "...";
                fetch(`${baseBackendUrl}/tasks/${taskId}`, {
                    method: "DELETE"
                }).then(() => {
                    const taskDivPadre = deleteTaskBtn.parentElement;
                    taskDivPadre.remove();
                });
            });
            taskParagraph.addEventListener("click", (e) => {
                input.value = task.name;
                createEditBtn.innerText = "Editar tarea";
                taskToEdit = task;
                console.log({ taskToEdit });
            });
            taskContainerDiv.appendChild(taskParagraph);
            taskContainerDiv.appendChild(deleteTaskBtn);
            tasksContainer.appendChild(taskContainerDiv);
            console.log(task);
        }
    });
}

getTasks();