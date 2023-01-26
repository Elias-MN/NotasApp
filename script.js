let addColumnButton = document.getElementById("addColumn");
let container = document.getElementById("container");
let inputColor = document.getElementById("background-color");


//TODO: https://designdrastic.com/tutorial/get-the-value-of-input-type-color-onchange
inputColor.addEventListener("change", SetColor);

let table = {};
let idColumn;
let idCard;

let columns;

class column {
    constructor(id) {
        this.id = id;
    }
    title = "";
    cards = [];
};

class card {
    constructor(id) {
        this.id = id;
    }
    text = "";
}

checkLS();

function checkLS() {
    let tableJSON = localStorage.getItem('table');
    if (tableJSON == null) {
        idColumn = 0;
        idCard = 0;
        table.idColumnCounter = idColumn;
        table.idCardCounter = idCard;
        columns = [];
    } else {
        table = JSON.parse(tableJSON);
        idColumn = table.idColumnCounter;
        idCard = table.idCardCounter;
        columns = table.columns;
        UpdateApp();
    }
}

function UpdateApp() {
    columns.forEach(dataColumn => {
        let divColumn = CreateColumn(dataColumn);
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

function CreateColumn(dataColumn) {
    let divColumn = document.createElement("div");
    let title = "";

    if (dataColumn) {
        divColumn.setAttribute("id", dataColumn.id);
        title = dataColumn.title;
    } else {
        divColumn.setAttribute("id", idColumn);
    }

    divColumn.classList.add("column");

    divColumn.innerHTML = `
                                    <div>
                                        <p class="deleteColumn" onclick="DeleteColumn(event)">Eliminar Columna</p>
                                    </div>
                                    <div class="menuColumn">
                                        <textarea onblur="TextTitleChanged(event)" class="title" placeholder="Insertar título" onkeydown="if(event.keyCode === 13) event.preventDefault();">${title}</textarea>
                                    </div>
                                    <div ondrop="CardDrop(event)" ondragover="AllowDrop(event)" class="drop-container">+</div>
                                    <button class="addCard" onclick="AddNewCard(this)">Añadir tarjeta</button>
                                    `;

    if (dataColumn) {
        for (let card = 0; card < dataColumn.cards.length; card++) {
            console.log(divColumn.children[0]);
            AddNewCard(divColumn.children[0]);
        }

    }

    idColumn++;
    return divColumn;
}

function AddNewColumn() {
    //Añadir a LS
    let columnObj = new column(idColumn);
    let divColumn = CreateColumn();
    container.insertBefore(divColumn, addColumnButton);
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
    console.log(button);
    let divCard = document.createElement("div");
    divCard.setAttribute("draggable", "true");
    let cardObj = new card(idCard);
    divCard.setAttribute("id", idCard);
    idCard++;
    table.idCardCounter = idCard;

    let idCurrentColumn = button.parentNode.id;
    table.columns.forEach((element, index) => {
        if (element.id == idCurrentColumn) {
            table.columns[index].cards.push(cardObj);
            updateLSTable();
        }
    });

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
    let idDOM = event.target.parentNode.parentNode.id;
    event.target.parentNode.parentNode.remove();
    table.columns.forEach((element, index) => {
        if (element.id == idDOM) {
            table.columns.splice(index, 1);
        }
    });

    updateLSTable();
}

function TextTitleChanged(event) {
    let idDOM = event.target.parentNode.parentNode.id;
    table.columns.forEach((element, index) => {
        if (element.id == idDOM) {
            table.columns[index].title = event.target.value;
        }
    });
    updateLSTable();
}

function TextCardChanged(event) {

}
