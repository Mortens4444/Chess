class ChessGame {
	constructor() {
		this.chessBoardBuilder = new ChessBoardBuilder();
	}
	
	switchSide() {
		this.chessBoardBuilder.switchSide();
	}

	newGame() {
		this.chessBoardBuilder.resetStates();
		this.showChessBoard();
	}

	showChessBoard() {
		this.chessBoardBuilder.showChessBoard();
	}
}

const chessGame = new ChessGame();