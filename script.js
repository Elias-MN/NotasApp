let addColumnButton = document.getElementById("addColumn");
let container = document.getElementById("container");
let inputColor = document.getElementById("background-color");

let table = {};
let idColumn;
let idCard;
let columns;
let currentElement;
let color1;

//TODO:
// Añadir un segundo color para botones: https://stackdiary.com/change-css-variable-value-javascript/
// Cambiar cursor a grab, grabbing, drop... cuando se arrastren tarjetas: https://www.w3schools.com/cssref/pr_class_cursor.php

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

// Función que recupera los datos de memoria
function checkLS() {
    let tableJSON = localStorage.getItem('table');

    // Sólo se ejecutará esta condición al inicio de la aplicación
    if (tableJSON == null) {
        idColumn = 0;
        idCard = 0;
        color1 = "#7575ed";
        table.idColumnCounter = idColumn;
        table.idCardCounter = idCard;
        table.backgroundColor = color1;
        columns = [];
    } else {
        table = JSON.parse(tableJSON);
        idColumn = table.idColumnCounter;
        idCard = table.idCardCounter;
        color1 = table.backgroundColor;
        if (table.columns) {
            columns = table.columns;
        } else {
            columns = [];
        }
        printColumns();
    }
    container.style.background = color1;
    inputColor.value = color1;
}

// Función que actualiza las columnas en pantalla
function printColumns() {
    columns.forEach(dataColumn => {
        let divColumn = createColumn(dataColumn);
        container.insertBefore(divColumn, addColumnButton);
    });
}

// Función que actualiza los colores en pantalla
function setColor() {
    container.style.background = inputColor.value;
}

// Función que crea la estructura de una columna
function createColumn(dataColumn) {
    let divColumn = document.createElement("div");
    let title = "";

    // Si la columna estaba en memoria le asigno sus valores, sino los pongo nuevos
    if (dataColumn) {
        divColumn.setAttribute("id", dataColumn.id);
        title = dataColumn.title;
    } else {
        divColumn.setAttribute("id", idColumn);
        idColumn++;
        table.idColumnCounter = idColumn;
    }

    divColumn.classList.add("column");

    divColumn.innerHTML = `
                                    <div>
                                        <p class="deleteColumn" onclick="deleteColumn(event)">Eliminar Columna</p>
                                    </div>
                                    <div class="menuColumn">
                                        <textarea onblur="updateLSTable()" class="title" placeholder="Insertar título" onkeydown="if(event.keyCode === 13) event.preventDefault();">${title}</textarea>
                                    </div>
                                    <div ondrop="dropCard(event)" ondragover="allowDrop(event)" class="drop-container">+</div>
                                    <button class="addCard" onclick="addNewCard(this)">Añadir tarjeta</button>
                                    `;

    // Si la columna estaba en memoria, le asigno sus tarjetas
    if (dataColumn) {
        for (let card = 0; card < dataColumn.cards.length; card++) {
            let columnReference = divColumn.children[0];
            let currentCard = dataColumn.cards[card];
            addNewCard(columnReference, currentCard);
        }
    }

    return divColumn;
}

// Función que añade una columna a la tabla
function addNewColumn() {
    let columnObj = new column(idColumn);
    let divColumn = createColumn();
    container.insertBefore(divColumn, addColumnButton);
    table.idColumnCounter = idColumn;
    columns.push(columnObj);
    table.columns = columns;
    updateLSTable();
}

// Función que crea la estructura de una tarjeta y la añade a la columna correspondiente
function addNewCard(columnReference, dataCard) {
    let divCard = document.createElement("div");
    divCard.setAttribute("draggable", "true");

    // Si la tarjeta estaba en memoria le asigno sus valores, sino los pongo nuevos
    if (dataCard) {
        divCard.setAttribute("id", dataCard.id);
    } else {
        divCard.setAttribute("id", idCard);
        idCard++;
        table.idCardCounter = idCard;
    }

    divCard.addEventListener('dragstart', dragStartCard);
    let textarea = document.createElement("textarea");

    // Si la tarjeta estaba en memoria le asigno su valor al textarea, sino se queda en blanco
    if (dataCard) {
        textarea.value = dataCard.text;
    }
    textarea.setAttribute("onblur", "updateLSTable()");

    textarea.classList.add("card");
    divCard.appendChild(textarea);
    let dropContainer = columnReference.parentNode.getElementsByClassName("drop-container");

    // Inserta la tarjeta por encima del elemento drop
    columnReference.parentNode.insertBefore(divCard, dropContainer[0]);

    // Si la tarjeta es nueva, se actualiza en memoria
    if (!dataCard) {
        updateLSTable();
    }
}

// Función que suelta el elemento que se está arrastrando
function dropCard(event) {
    let dropContainer = event.target.parentNode.getElementsByClassName("drop-container");
    event.target.parentNode.insertBefore(currentElement, dropContainer[0]);
    updateLSTable();
}

// Función que permite que a un elemento le puedan solar otros elementos
function allowDrop(event) {
    event.preventDefault();
}

// Función que actualiza el elemento que se está arrastrando
function dragStartCard(event) {
    currentElement = event.target;
}

// Función que elimina una tarjeta
function deleteCard() {
    currentElement.remove();
    updateLSTable();
}

// Función que elimina una columna
function deleteColumn(event) {
    event.target.parentNode.parentNode.remove();
    updateLSTable();
}

// Función que actualiza todos los datos de la tabla en memoria (LocalStorage, Base de Datos...)
function updateLSTable() {
    table.backgroundColor = inputColor.value;

    let updateColumns = [];
    for (let element = 1; element < container.children.length - 1; element++) {
        let updateCards = [];
        let currentColumn = container.children[element];
        let currentColumnID = currentColumn.getAttribute('id');
        let currentColumnTitle = currentColumn.getElementsByClassName("title")[0].value;
        let currentColumnCards = currentColumn.querySelectorAll("[draggable]");

        let columnObj = new column(currentColumnID);
        columnObj.title = currentColumnTitle;

        for (let element = 0; element < currentColumnCards.length; element++) {
            let currentCard = currentColumnCards[element];
            let currentCardValue = currentCard.firstChild.value;
            let currentCardID = currentCard.getAttribute('id');
            let cardObj = new card(currentCardID);
            cardObj.text = currentCardValue;
            updateCards.push(cardObj);
        }
        columnObj.cards = updateCards;
        updateColumns.push(columnObj);
    }

    table.columns = updateColumns;
    let tableToJSON = JSON.stringify(table);
    localStorage.setItem('table', tableToJSON);
}

// Función principal
function main() {
    inputColor.addEventListener("change", updateLSTable);
    inputColor.addEventListener("input", setColor);
    addColumnButton.addEventListener("click", addNewColumn);
    checkLS();
}

main();
