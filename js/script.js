document.addEventListener( "DOMContentLoaded", function () {
	new NumbleGame();
} );

class NumbleGame {
	constructor() {
		this.Scores = [];
		this.gameRow = 1;
		this.submitButton = document.querySelector( '.submit' );
		this.answer = document.querySelectorAll( '.row .row-answer .answer' );
		this.scoreCount = 1;

		this.registerListeners();
		this.disableButtons();
		this.enableRow( 1 );
		this.generateEquation();
	}

	registerListeners() {
		this.submitButton.addEventListener( 'click', e => {
			e.preventDefault();
			if ( this.gameOver ) {
				this.clearBoard();
				this.gameOver = false;
			} else {
				const isExerciseCorrect = this.checkExerciseCorrect();
				if ( isExerciseCorrect ) {
					this.checkRow( this.gameRow );
				} else {
					this.WrongExercise();
				}
			}

		} );
	}

	checkExerciseCorrect() {
		let exerciseValue = '';
		let rowInputs = document.querySelectorAll( '.row-' + this.gameRow + '>.btn' );
		rowInputs.forEach( ( element, index ) => {
			exerciseValue = exerciseValue + element.value;
		} );
		if ( eval( exerciseValue ) === this.exerciseAnswer ) {
			return true;
		} else {
			return false;
		}
	}

	checkRow( row ) {
		let correct = [];
		let rowInputs = document.querySelectorAll( '.row-' + row + '>.btn' );
		rowInputs.forEach( ( element, index ) => {
			if ( this.exerciseArray[ index ] === element.value ) {
				this.showCorrect( element );
				correct.push( true );
			} else if ( this.exerciseArray.includes( element.value ) ) {
				this.showNotInPlace( element );
				correct.push( false );
			} else {
				this.showWrong( element );
				correct.push( false );
			}
		} );

		if ( correct.filter( value => value === true ).length === 7 ) {
			this.saveScore( row );
			return;
		}

		if ( row === 6 ) {
			this.saveScore( row );
		} else {
			document.querySelector( '.row-' + row + ' .row-answer' ).style.display = 'none';
			this.gameRow ++;
			this.enableRow( this.gameRow );
		}
	}

	WrongExercise() {
		document.querySelector( '.row-' + this.gameRow + ' .row-answer .equal' ).style.borderColor = 'red';
		document.querySelector( '.row-' + this.gameRow + ' .row-answer .answer' ).style.borderColor = 'red';
	}

	saveScore( attempts ) {
		this.Scores += '<p>' + this.scoreCount + '. Player 1 => ' + attempts + ' attempts</p>';
		this.showScoreOnBoard();
		this.endGame();
		this.scoreCount++;
	}

	showScoreOnBoard() {
		let scoreList = document.querySelector( '.score-list' );
		scoreList.innerHTML = this.Scores;
	}

	endGame() {
		this.gameOver = true;
		this.submitButton.innerHTML = 'New Game';
	}

	clearBoard() {
		let rowInputs = document.querySelectorAll( '.row .btn' );
		rowInputs.forEach( ( element, index ) => {
			element.value = '';
			element.style.backgroundColor = 'unset';
		} );

		let rowEquals = document.querySelectorAll( '.row .btn.equal' );
		rowEquals.forEach( ( element, index ) => {
			element.value = '=';
		} );
		let buttons = document.querySelectorAll( '.option-list .btn');
		buttons.forEach( ( element, index ) => {
			element.style.backgroundColor = 'unset';
		} );

		this.submitButton.innerHTML = 'Submit';
		this.disableButtons();
		this.enableRow(1);
		this.showFirstAnswer();
		this.gameRow = 1;
		this.generateEquation();
	}

	showFirstAnswer(){
		let answers = document.querySelectorAll( '.row .row-answer' );
		answers.forEach( ( element, index ) => {
			if(index === 0){
				element.style.display = 'inline';
			} else {
				element.style.display = 'none';
			}
		} );
	}

	updateOptionList( element, color ) {
		let value = element.value;
		if ( value === '*' ) {
			value = 'mul';
		} else if ( value === '/' ) {
			value = 'div';
		} else if ( value === '+' ) {
			value = 'add';
		} else if ( value === '-' ) {
			value = 'sub';
		}
		document.querySelector( '.option-list .option-' + value ).style.backgroundColor = color;
	}

	disableButtons() {
		let buttons = document.querySelectorAll( '.btn' );
		buttons.forEach( ( element, index ) => {
			element.disabled = true;
		} );
	}

	enableRow( row ) {
		let rowButtons = document.querySelectorAll( '.row-' + row + ' .btn' );
		rowButtons.forEach( ( element, index ) => {
			element.disabled = false;
		} );
		document.querySelector( '.row-' + row + ' .row-answer' ).style.display = 'inline';
	}

	generateEquation() {
		const n1 = this.getRandomInt( 9 );
		const o1 = this.getRandomOperator();
		const n2 = this.getRandomInt( 9 );
		const o2 = this.getRandomOperator();
		const n3 = this.getRandomInt( 9 );
		const o3 = this.getRandomOperator();
		const n4 = this.getRandomInt( 9 );

		const answer = n1 + o1 + n2 + o2 + n3 + o3 + n4;
		this.exerciseAnswer = eval( answer );
		this.answer.forEach( element => {
			element.value = this.exerciseAnswer;
		} );

		this.exerciseArray = [
			String( n1 ),
			o1,
			String( n2 ),
			o2,
			String( n3 ),
			o3,
			String( n4 )
		];
		console.log( this.exerciseArray );
	}

	getRandomInt( max ) {
		return Math.floor( Math.random() * max / 2 ) * 2;
	}

	getRandomOperator() {
		var ops = [ '+', '-', '*', '/' ];
		const operator = this.getRandomInt( 4 );
		return ops[ operator ];
	}

	showCorrect( element ) {
		element.style.backgroundColor = '#1dcc4e';
		this.updateOptionList( element, '#1dcc4e' );
	}

	showNotInPlace( element ) {
		element.style.backgroundColor = '#fa860a';
		this.updateOptionList( element, '#fa860a' );
	}

	showWrong( element ) {
		element.style.backgroundColor = '#585858';
		this.updateOptionList( element, '#585858' );
	}
}
