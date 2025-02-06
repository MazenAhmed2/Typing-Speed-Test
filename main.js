let isStarted = false;
let board = document.querySelector('.board');
let text = document.querySelector('.board').innerText;
let input = document.querySelector('.entry');
let RightLetters = 0;
let previousLetter = []
let typedWords = 0
let running = false
let statusLoopId;
let time = document.querySelector('#time')
let words = document.querySelector('#words')
let accuracy = document.querySelector('#accuracy')
let speed = document.querySelector('#speed')


// Making every character in span to be controlled
newBoard = '';
for (let letter of board.innerText){
    newBoard += `<span>${letter}</span>`
}
board.innerHTML = newBoard


/**
 * Is a Timer Object that has following methods :
 *  start() => Begin the timer
 *  stop()  => Stop the timer
 *  data()  => Returns [Time, Typed Words, Accuracy and Speed]
 */
let timer = {
    current: 0,

    /**
     * Start the timer
     */
    start : function () {
        this.id = setInterval(() => {
            this.current += 0.1;
        }, 100)
    } ,

    /**
     * Stop the timer
     */
    stop : function (){
        clearInterval(timer.id)
    },


    /**
     * Returns [Time, Typed Words, Accuracy and Speed]
    */
    data : function(){
        return [this.current.toFixed(2), typedWords, (RightLetters / input.value.length * 100).toFixed(2), ((RightLetters / 5) / (timer.current / 60)).toFixed(2)]
    }
}

/**
 * Stop all loops in the game
 */
function stopUpdates(){
    timer.stop()
    clearInterval(statusLoopId)
    input.oninput = null;
}


/**
 * Update the status board every 0.1sec
 */
function update_status(){
    statusLoopId = setInterval(() => {
        [a, b, c, d] = timer.data()
        time.innerText = `Time: ${a}`
        words.innerText = `Typed words: ${b}`
        accuracy.innerText = `Accuracy: ${c}%`
        speed.innerText = `Speed: ${d}`
    }, 100)
}

/**
 * Update the text 
 * @param {string} letter 
 * @param {string} inputType 
 */
function update_board(letter, inputType){
    let letterIndex = input.value.length - 1

    // If finished
    if (letterIndex >= text.length - 1){
        stopUpdates()
        message = document.querySelector('.win-message')
        score = document.querySelector('.message-text > span')
        score.innerText = timer.data()[3]
        message.style.display = 'flex';
        button = document.querySelector('button')
        button.onclick = (event)=>{
            message.style.display = 'none';
        }
    };

    // If backspace clicked
    if (inputType === 'deleteContentBackward'){
        board.children[letterIndex + 1].style.backgroundColor = board.style.backgroundColor
        if (previousLetter[previousLetter.length - 1] == 'right'){
            previousLetter.pop()
            RightLetters--;
        }
        if (previousLetter[previousLetter.length - 1] === ' '){
            previousLetter.pop()
            typedWords--;
        }
    // If any character clicked
    } else {
        if (text[letterIndex] === ' '){
            typedWords++;
            previousLetter.push(' ')
        };
        if (text[letterIndex] === letter){
            board.children[letterIndex].style.backgroundColor = '#0080008f'
            RightLetters++;
            previousLetter.push('right')
        } else {
            board.children[letterIndex].style.backgroundColor = '#ff00008f'
            previousLetter.push(null)
        }
    }
}



// Main command
input.oninput = function (event){
    if (!isStarted){
        isStarted = true;
        timer.start();
        update_status();
    }
    update_board(event.data, event.inputType)
}