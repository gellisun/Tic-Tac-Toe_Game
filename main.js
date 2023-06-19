/*----- constants -----*/
// object with keys of 'null' (when the square is empty), and players 1 & -1. The value assigned to each key represents the color to display for an empty square (null), player 1 and player -1.
const COLORS = {
	'null': 'lightgoldenrodyellow',
	'1': "black ",
	'-1': 'brown'
}
//define the 8 possible winning combinations, each containing three indexes of the board that make a winner if they hold the same player value.
const WINNING_COMBINATIONS = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
]
/*----- state variables -----*/
let board; //array of three columns array
let turn; //either 1 or -1
let winner; //null=no winner, 1/-1= winner, 'T'= tie
/*----- cached elements  -----*/
//store the 9 elements that represent the squares on the page
const messageEl = document.querySelector('h1');
const cellEls = [...document.querySelectorAll('div')];
const restartBtn = document.querySelector('button');
/*----- event listeners -----*/
document.getElementById('board').addEventListener('click', handleClick);
restartBtn.addEventListener('click', init);
/*----- functions -----*/
//initialize the state variables
init();

function init() {
	//as with connect four game has to be visualized rotated 90 degrees
	//array to represent the squares. initialize to 9 nulls to represent empty squares. The 9 elements will "map" to each square, where index 0 maps to the top-left square and index 8 maps to the bottom-right square.
	board = [null, null, null, null, null, null, null, null, null];
	//variable to remember whose turn it is. initialize whose turn it is to 1 (player 'X'). Player 'O' will be represented by -1
	turn = 1;
	//initialize to represent that there is no winner or tie yet. Winner will hold the player value (1 or -1) if there's a winner. Winner will hold a 'T' if there's a tie. 
	winner = null;
	render();
}
//handle a player clicking a square and then render
function handleClick(e) {
	//obtain the index of the square that was clicked by either:
	//"Extracting" the index from an id assigned to the element in the HTML, or
	//Looping through the cached square elements using a for loop and breaking out when the current square element equals the event object's target.
	const idx = cellEls.indexOf(e.target);
	cellEls.forEach(function (cellEl) {
		if (cellEl === e.target) {
			return;
		}
	})
	//if the board has a value at the index, immediately return because that square is already taken.
	if (board[idx]) {
		return;
	}
	//if winner is not null, immediately return because the game is over.
	if (winner) {
		return;
	}

	//update the board array at the index with the value of turn.
	board[idx] = turn;
	//flip turns by multiplying turn by -1 (flips a 1 to -1, and vice-versa).
	turn *= -1;
	//set the winner variable if there's a winner:
	winner = getWinner();
	//all state has been updated, so render the state to the page (step 4.2).
	render();
}
//NOT WORKING FROM HERE!!!!
function getWinner() {
	//loop through the each of the winning combination arrays defined.
	for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
		//total up the three board positions using the three indexes in the current combo.
		const combination = WINNING_COMBINATIONS[i];
		const position1 = combination[0];
		const position2 = combination[1];
		const position3 = combination[2];
		const total = board[position1] + board[position2] + board[position3];
		//convert the total to an absolute value (convert any negative total to positive).
		const absTotal = Math.abs(total);
		//if the total equals 3, we have a winner! Set winner to the board's value at the index specified by the first index in the combo array. Exit the loop.
		if (absTotal === 3) {
			winner = board[position1];
			return winner;
		}
	}
	//if there's no winner, check if there's a tie:
	//set winner to 'T' if there are no more nulls in the board array.
	if (board.includes(null)) {
		return null;
	} else {
		return 'T';
	}
}
//render state variables to the page
function render() {
	renderBoard();
	renderMessage();
}

function renderBoard() {
	//loop over each of the 9 elements that represent the squares on the page, and for each iteration:
	board.forEach(function (cellVal, idx) {
		//use the index of the iteration to access the mapped value from the board array.
		const cellEl = document.getElementById(`cell-${idx}`);
		//set the background color of the current element by using the value as a key on the colors lookup object (constant).
		cellEl.style.backgroundColor = COLORS[cellVal];
	});
};

function renderMessage() {
	//if winner is equal to 'T' (tie), render a tie message.
	if (winner === 'T') {
		messageEl.innerText = "It's a Tie!!!";
	}
	//otherwise, render a congratulatory message to which player has won - use the color name for the player, converting it to uppercase.

	else if (winner) {
		messageEl.innerHTML = `<span style="color: ${COLORS[winner]}">${COLORS[winner].toUpperCase()}</span> Wins!`;
	}
	else {
		//if winner has a value other than null (game still in progress), render whose turn it is - use the color name for the player, converting it to upper case.
		messageEl.innerHTML = `<span style="color: ${COLORS[turn]}">${COLORS[turn].toUpperCase()}</span>'s Turn`;
	}
}
//wait for the user to click a square