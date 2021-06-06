include("light_state.js");

const a = "A";
const h = "H";
const table = "table"; 
const th = "th";
const tr = "tr";
const td = "td";
const tc = "tc";

let moveFrom = null;
let darkToMove = false;

function switchSide() {
	darkToMove = !darkToMove;
	showOnChessTable();
}

function include(sourceFile) {
  let script  = document.createElement("script");
  script.src  = sourceFile;
  script.type = "text/javascript";
  script.defer = true;
  let head = document.getElementsByTagName("head")[0];
  head.appendChild(script);
}

function charShift(ch, shift) {
	return String.fromCharCode(ch.charCodeAt(0) + shift);
}

function createTableColumns(tableBody) {
	let header = document.createElement(tr);
	tableBody.appendChild(header);
	header.appendChild(document.createElement(th));
	
	for (let columnIndex = 1; columnIndex <= 8; columnIndex++) {
		let column = document.createElement(th);
		column.setAttribute("id", tc + columnIndex);
		column.textContent = darkToMove ? charShift(h, 1 - columnIndex) : charShift(a, columnIndex - 1);
		header.appendChild(column);
	}
}

function createTableRow(tableBody, rowNumber) {
	let row = document.createElement(tr);
	tableBody.appendChild(row);

	let rowHeader = document.createElement(th);
	rowHeader.setAttribute("id", tr + rowNumber);
	rowHeader.textContent = rowNumber;
	row.appendChild(rowHeader);

	return row;
}

function isWhiteOnTop() {
	return initialState[0][0] == '♖';
}

function createSquares(tableBody) {
	for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
		let rowNumber = darkToMove ? rowIndex + 1 : 8 - rowIndex;
		let row = createTableRow(tableBody, rowNumber);
		
		for (let columnIndex = 0; columnIndex < 8; columnIndex++) {
			let cell = document.createElement(td);
			let columnName = darkToMove ? charShift(h, -columnIndex) : charShift(a, columnIndex);
			cell.setAttribute("id", columnName + rowNumber);
			cell.onclick = function(event) {
				if (moveFrom == null) {
					cell.classList.add("selected");
					moveFrom = cell;
				} else {
					moveFrom.classList.remove("selected");

					let toCellIndex = getCellIndex(cell);
					let fromCellIndex = getCellIndex(moveFrom);
					
					state[toCellIndex.rank][toCellIndex.column] = state[fromCellIndex.rank][fromCellIndex.column];
					state[fromCellIndex.rank][fromCellIndex.column] = ' ';
					
					showOnChessTable();
					moveFrom = null;
				}
			}
			onclick="newGame();"
			cell.setAttribute("class", (rowIndex + columnIndex) % 2 == 1 ? "dark" : "light");
			cell.textContent = isWhiteOnTop() ? state[rowNumber - 1][darkToMove ? columnIndex : 7 - columnIndex] :
												state[darkToMove ? 7 - rowIndex : rowIndex][darkToMove ? 7 - columnIndex : columnIndex];
			row.appendChild(cell);
		}
	}
}

function getCellIndex(cell) {
	let rank = parseInt(cell.id[1]);
	return isWhiteOnTop() ? {  column: h.charCodeAt(0) - cell.id.charCodeAt(0), rank: rank - 1 } : { column: a.charCodeAt(0) - cell.id.charCodeAt(0) - 1, rank: 8 - rank };
}

function createChessTable() {
	let body = document.getElementsByTagName("body")[0];
	let board = document.createElement(table);
	board.setAttribute("class", "chess-board");
	body.appendChild(board);
	let tableBody = document.createElement("tbody");
	board.appendChild(tableBody);

	createTableColumns(tableBody);
	createSquares(tableBody);
}

function newGame() {
	for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
		state[rowIndex] = initialState[rowIndex].map((x) => x);
	}
	showOnChessTable();
}

function showOnChessTable() {
	let board = document.getElementsByTagName(table)[0];
	if (board) {
		board.remove();
	}
	createChessTable();
}