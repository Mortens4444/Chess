include("light_state.js");
//include("dark_state.js");

const a = "A";
const h = "H";
const table = "table"; 
const th = "th";
const tr = "tr";
const td = "td";
const tc = "tc";
const id = "id";
const selected = "selected";

let moveFrom = null;
let darkToMove = false;

function switchSide() {
	darkToMove = !darkToMove;
	showOnChessTable();
}

function include(sourceFile) {
  let head = document.getElementsByTagName("head")[0];
  let script  = createElement("script", head);
  script.src  = sourceFile;
  script.type = "text/javascript";
  script.defer = true;
}

function charShift(ch, shift) {
	return String.fromCharCode(ch.charCodeAt(0) + shift);
}

function createElement(elementName, parent) {
	let element = document.createElement(elementName);
	parent.appendChild(element);
	return element;
}

function createTableFiles(tableBody) {
	let header = createElement(tr, tableBody);
	createElement(th, header);
	
	for (let fileIndex = 0; fileIndex < 8; fileIndex++) {
		let fileText = getFileText(fileIndex);
		createTableHeaderCell(header, tc + fileIndex + 1, fileText);
	}
}

function createTableHeaderCell(parent, idValue, text) {
	let header = createElement(th, parent);
	header.setAttribute(id, idValue);
	header.textContent = text;
}

function createTableRank(tableBody, rankNumber) {
	let rank = createElement(tr, tableBody);
	createTableHeaderCell(rank, tr + rankNumber, rankNumber);
	return rank;
}

function getFileText(fileIndex) {
	return darkToMove ? charShift(h, -fileIndex) : charShift(a, fileIndex);
}

function isWhiteOnTop() {
	return initialState[0][0] == '♖';
}

function createSquares(tableBody) {
	for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
		let rankNumber = darkToMove ? rankIndex + 1 : 8 - rankIndex;
		let rank = createTableRank(tableBody, rankNumber);
		
		for (let fileIndex = 0; fileIndex < 8; fileIndex++) {
			let cell = createElement(td, rank);
			cell.setAttribute(id, getFileText(fileIndex) + rankNumber);
			cell.onclick = cellOnClick;
			cell.setAttribute("class", (rankIndex + fileIndex) % 2 == 1 ? "dark" : "light");
			cell.textContent = isWhiteOnTop() ? state[rankNumber - 1][darkToMove ? fileIndex : 7 - fileIndex] :
												state[darkToMove ? 7 - rankIndex : rankIndex][darkToMove ? 7 - fileIndex : fileIndex];
		}
	}
}

function cellOnClick(event) {
	if (moveFrom == null) {
		this.classList.add(selected);
		moveFrom = this;
	} else {
		moveFrom.classList.remove(selected);

		let toCell = getCell(this);
		let fromCell = getCell(moveFrom);
		
		state[toCell.rank][toCell.file] = state[fromCell.rank][fromCell.file];
		state[fromCell.rank][fromCell.file] = ' ';
		
		showOnChessTable();
		moveFrom = null;
	}
}

function getCell(cell) {
	let rank = parseInt(cell.id[1]);
	let file = cell.id.charCodeAt(0);
	return isWhiteOnTop() ?
		{ file: h.charCodeAt(0) - file, rank: rank - 1 } :
		{ file: file - a.charCodeAt(0), rank: 8 - rank };
}

function createChessTable() {
	let body = document.getElementsByTagName("body")[0];
	let board = createElement(table, body);
	board.setAttribute("class", "chess-board");
	let tableBody = createElement("tbody", board);

	createTableFiles(tableBody);
	createSquares(tableBody);
}

function newGame() {
	for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
		state[rankIndex] = initialState[rankIndex].map((x) => x);
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