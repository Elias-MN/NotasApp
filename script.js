let addColumnButton = document.getElementById("addColumn");
let container = document.getElementById("container");
let inputColor = document.getElementById("background-color");

inputColor.addEventListener("change", SetColor);

let table = {};
let idColumn;
let columns;

class column {
    constructor(id) {
        this.id = id;
    }
    title = "";
    cards = [];
};

checkLS();

function checkLS() {
    let tableJSON = localStorage.getItem('table');
    if (tableJSON == null) {
        idColumn = 0;
        columns = [];
    } else {
        table = JSON.parse(tableJSON);
        idColumn = table.idColumnCounter;
        columns = table.columns;
        UpdateApp();
    }
}

function UpdateApp() {
    columns.forEach(column => {
        //console.log(column);
        let divColumn = CreateColumn();
        container.insertBefore(divColumn, addColumnButton);

    });
}

function SetColor() {
    table.backgroundColor = inputColor.value;
    updateLSTable();
    container.style.background = inputColor.value;
}

function GetColor() {
    let tableJSON = localStorage.getItem('table');
    if (tableJSON == null) { return; }
    table = JSON.parse(tableJSON);
    inputColor.value = table.backgroundColor;
    container.style.background = table.backgroundColor;
}
GetColor();

addColumnButton.addEventListener("click", AddNewColumn);

function CreateColumn() {
    let divColumn = document.createElement("div");
    divColumn.classList.add("column");
    divColumn.innerHTML = `
                                    <div>
                                        <p class="deleteColumn" onclick="DeleteColumn(event)">Eliminar Columna</p>
                                    </div>
                                    <div class="menuColumn">
                                        <textarea class="title" placeholder="Insertar título" onkeydown="if(event.keyCode === 13) event.preventDefault();"></textarea>
                                    </div>
                                    <div ondrop="CardDrop(event)" ondragover="AllowDrop(event)" class="drop-container">+</div>
                                    <button class="addCard" onclick="AddNewCard(this)">Añadir tarjeta</button>
                                    `;
    return divColumn;
}

function AddNewColumn() {
    let divColumn = CreateColumn();
    container.insertBefore(divColumn, addColumnButton);

    //Añadir a LS
    let columnObj = new column(idColumn);
    idColumn++;
    table.idColumnCounter = idColumn;
    columns.push(columnObj);
    table.columns = columns;
    updateLSTable();
}

function updateLSTable() {
    let tableToJSON = JSON.stringify(table);
    localStorage.setItem('table', tableToJSON);
}


// Añadir nueva tarjeta
function AddNewCard(button) {
    let divCard = document.createElement("div");
    divCard.setAttribute("draggable", "true");

    // ondragstart se activa cuando un usuario comienza a arrastrar un elemento.
    divCard.addEventListener('dragstart', CardDragStart);

    let textarea = document.createElement("textarea");
    textarea.classList.add("card");
    divCard.appendChild(textarea);
    let dropContainer = button.parentNode.getElementsByClassName("drop-container"); //  button.parentNode referencia a la columna
    button.parentNode.insertBefore(divCard, dropContainer[0]);
}


// Eventos tarjetas
let currentElement;

function CardDrop(event) {
    let dropContainer = event.target.parentNode.getElementsByClassName("drop-container");
    event.target.parentNode.insertBefore(currentElement, dropContainer[0]);
}
function AllowDrop(event) {
    event.preventDefault();
}
function CardDragStart(event) {
    currentElement = event.target;
}
function CardDelete() {
    currentElement.remove();
}
function DeleteColumn(event) {
    event.target.parentNode.parentNode.remove();
}
