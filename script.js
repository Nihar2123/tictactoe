function GameBoard(){
    const board = [];
    for(let i = 0; i < 3; i++){
        board[i] = [];
        for(let j = 0; j < 3; j++){
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;
    const printBoard = () => {
        for(let i = 0; i < 3; i++){
            console.log(board[i][0].getValue() + ' ' + board[i][1].getValue() + ' ' + board[i][2].getValue());
        }
    }
    const checkWinner = () => {
        let flag = true;
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){if(board[i][j].getValue() === 0){flag = false;}}
            if(board[i][0].getValue() === board[i][1].getValue() && board[i][1].getValue() === board[i][2].getValue()){
                if(board[i][0].getValue() !== 0)
                    return board[i][0].getValue();
            }
        }
        for(let i = 0; i < 3; i++){
            if(board[0][i].getValue() === board[1][i].getValue() && board[1][i].getValue() === board[2][i].getValue()){
                if(board[0][i].getValue() !== 0)
                    return board[0][i].getValue();
            }
        }
        if(board[0][0].getValue() === board[1][1].getValue() && board[1][1].getValue() === board[2][2].getValue()) {
            if (board[0][0].getValue() !== 0)
                return board[0][0].getValue();
        }
        if(board[0][2].getValue() === board[1][1].getValue() && board[1][1].getValue() === board[2][0].getValue()) {
            if (board[0][2].getValue() !== 0)
                return board[0][2].getValue();
        }

        if(flag === true)
            return -1;
        return 0;
    }

    return {getBoard, printBoard, checkWinner};
}

function Cell(){
    let value = 0;
    const addToken = (player) => {
        if(value !== 0) return;
        value = player;
    }
    const getValue = () => value;

    return{addToken, getValue}
}

function GameController(playerOneName = "Player One",playerTwoName = "Player Two"){
    const board = GameBoard();
    const players = [{name: playerOneName, token: 1}, {name: playerTwoName, token: 2}];
    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = (activePlayer === players[0])? players[1]: players[0];
    }
    const getActivePlayer = () => activePlayer;
    const playRound = (row, col) => {
        const playableBoard = board.getBoard();
        if(playableBoard[row][col].getValue() === 0) {
            playableBoard[row][col].addToken(activePlayer.token);
            switchPlayerTurn();
        }
        board.printBoard();
    }

    board.printBoard();
    return {switchPlayerTurn, getActivePlayer, getBoard: board.getBoard, playRound, checkWinner: board.checkWinner};
}

function ScreenController(){
    const game = GameController();
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");

    const UpdateScreen = () => {
        boardDiv.innerHTML = "";
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        let val = game.checkWinner();//console.log(val);
        if(val !== 0){
            if(val === 1) playerTurnDiv.textContent = `Player One Wins`;
            if(val === 2) playerTurnDiv.textContent = `Player Two Wins`;
            if(val === -1) playerTurnDiv.textContent = `It's a Draw`;
        }
        else {
            playerTurnDiv.textContent = `${activePlayer.name}'s turn`;
        }

        board.forEach((row, indexRow) => {
            row.forEach((cell, indexCol) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

                cellButton.dataset.row = indexRow;
                cellButton.dataset.column = indexCol;
                let text = '';
                if (cell.getValue() === 1) text = 'X';
                else if (cell.getValue() === 2) text = 'O';
                cellButton.textContent = text;
                boardDiv.appendChild(cellButton);
            })
        });
    }

    function clickHandlerBoard(e){
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;
        if(!selectedColumn && !selectedRow) return;

        if(game.checkWinner() === 0)
           game.playRound(selectedRow, selectedColumn);
        UpdateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);
    UpdateScreen();
}

ScreenController();