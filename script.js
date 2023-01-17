let addColumnButton = document.getElementById("addColumn");
let container = document.getElementById("container");
addColumnButton.addEventListener("click", AddNewColumn);

// Añadir nueva columna
function AddNewColumn() {
    let divColumn = document.createElement("div");
    divColumn.classList.add("column");

    // ondragover se activa cuando un elemento está siendo arrastrado sobre otro elemento.
    //   Es necesario utilizar este evento para permitir que un elemento sea un "destino" válido
    //   para el elemento arrastrado. Por defecto, el navegador impide que se suelten elementos
    //   en una mayoría de los elementos, por lo que es necesario especificar manualmente que
    //   un elemento es un destino válido para el elemento arrastrado.
    // ondrop se activa cuando un elemento es soltado en un destino válido.
    divColumn.innerHTML = `
                                    <div>
                                        <textarea class="title" placeholder="Insertar título" onkeydown="if(event.keyCode === 13) event.preventDefault();"></textarea>
                                    </div>
                                    <div ondrop="CardDrop(event)" ondragover="AllowDrop(event)" class="drop-container">+</div>
                                    <button class="addCard" onclick="AddNewCard(this)">Añadir tarjeta</button>
                                    `;
    container.insertBefore(divColumn, addColumnButton);
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
