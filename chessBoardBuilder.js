if (!loadDarkState) {
	include("lightState.js");
} else {
	include("darkState.js");
}

const a = "A";
const h = "H";
const table = "table";
const th = "th";
const tr = "tr";
const td = "td";
const tc = "tc";
const id = "id";
const selected = "selected";

class ChessBoardBuilder {
	constructor() {
		this.domManipulator = new DomManipulator();
		this.moveFrom = null;
		this.whiteOnTopWhenShow = false;
	}
	
	createChessBoard() {
		let body = document.getElementsByTagName("body")[0];
		let board = this.domManipulator.createElement(table, body);
		board.setAttribute("class", "chess-board");
		let tableBody = this.domManipulator.createElement("tbody", board);

		this.createTableFiles(tableBody);
		this.createSquares(tableBody);
	}

	createTableFiles(tableBody) {
		let header = this.domManipulator.createElement(tr, tableBody);
		this.domManipulator.createElement(th, header);	
		for (let fileIndex = 0; fileIndex < 8; fileIndex++) {
			this.createTableHeaderCell(header, tc + fileIndex + 1, this.getFileText(fileIndex));
		}
	}

	createTableHeaderCell(parent, idValue, text) {
		let header = this.domManipulator.createElement(th, parent);
		header.setAttribute(id, idValue);
		header.textContent = text;
	}

	createTableRank(tableBody, rankNumber) {
		let rank = this.domManipulator.createElement(tr, tableBody);
		this.createTableHeaderCell(rank, tr + rankNumber, rankNumber);
		return rank;
	}
	
	createSquares(tableBody) {
		for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
			let rankNumber = this.whiteOnTopWhenShow ? rankIndex + 1 : 8 - rankIndex;
			let rank = this.createTableRank(tableBody, rankNumber);
			
			for (let fileIndex = 0; fileIndex < 8; fileIndex++) {
				let cell = this.domManipulator.createElement(td, rank);
				cell.setAttribute(id, this.getFileText(fileIndex) + rankNumber);
				cell.onclick = this.cellOnClick.bind(this);
				cell.setAttribute("class", (rankIndex + fileIndex) % 2 == 1 ? "dark" : "light");
				cell.textContent = this.isWhiteOnTopInStateRepresentation() ?
					state[rankNumber - 1][this.whiteOnTopWhenShow ? fileIndex : 7 - fileIndex] :
					state[this.whiteOnTopWhenShow ? 7 - rankIndex : rankIndex][this.whiteOnTopWhenShow ? 7 - fileIndex : fileIndex];
			}
		}
	}

	cellOnClick(event) {
		if (this.moveFrom == null) {
			this.moveFrom = event.srcElement;
			this.moveFrom.classList.add(selected);
		} else {
			this.moveFrom.classList.remove(selected);

			let toCell = this.getCell(event.srcElement);
			let fromCell = this.getCell(this.moveFrom);
			
			state[toCell.rankIndex][toCell.fileIndex] = state[fromCell.rankIndex][fromCell.fileIndex];
			state[fromCell.rankIndex][fromCell.fileIndex] = ' ';
			
			this.showChessBoard();
			this.moveFrom = null;
		}
	}

	getCell(cell) {
		let rank = parseInt(cell.id[1]);
		let file = cell.id.charCodeAt(0);
		return this.isWhiteOnTopInStateRepresentation() ?
			{ fileIndex: h.charCodeAt(0) - file, rankIndex: rank - 1 } :
			{ fileIndex: file - a.charCodeAt(0), rankIndex: 8 - rank };
	}
	
	charShift(ch, shift) {
		return String.fromCharCode(ch.charCodeAt(0) + shift);
	}

	getFileText(fileIndex) {
		return this.whiteOnTopWhenShow ? this.charShift(h, -fileIndex) : this.charShift(a, fileIndex);
	}

	isWhiteOnTopInStateRepresentation() {
		return initialState[0][0] == '♖';
	}
	
	resetStates() {
		for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
			state[rankIndex] = initialState[rankIndex].map((x) => x);
		}
	}
	
	showChessBoard(whiteOnTopWhenShow) {
		if (whiteOnTopWhenShow != undefined) {
			this.whiteOnTopWhenShow = whiteOnTopWhenShow;
		}
		let board = document.getElementsByTagName(table)[0];
		if (board) {
			board.remove();
			this.moveFrom = null;
		}
		this.createChessBoard();
	}
	
	switchSide() {
		this.showChessBoard(!this.whiteOnTopWhenShow);
	}
}