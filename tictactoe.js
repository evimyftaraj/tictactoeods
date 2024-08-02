const start = document.querySelector('#start');
const startAI = document.querySelector('#startAI');
const reset = document.querySelector('#reset');
const resetAI = document.querySelector('#resetAI');
const grid = document.querySelector('.grid');
const gridItems = document.querySelectorAll('.gridItem');
const gridArray = Array.from(gridItems);
const player1Input = document.querySelector('#player1Input');
const player2Input = document.querySelector('#player2Input');
const player1InputAI = document.querySelector('#player1InputAI');
const currentPlayerDisplay = document.querySelector('#currentPlayerDisplay');
const currentPlayerDisplayAI = document.querySelector('#currentPlayerDisplayAi');
const friendButton = document.querySelector('#friend');
const aiButton = document.querySelector('#ai');
const playerGame = document.querySelector('#playerGame')
const introSection = document.querySelector('#introSection');
const aiGame = document.querySelector('#aiGame');
const aiInput = document.querySelector('#aiInput');

let player1, player2, currentPlayer; // initialize player1, player2, currentplayer, ai outside since they will be used throughout

friendButton.addEventListener('click', () => {
    if (playerGame.classList.contains('hidden')) {
        playerGame.classList.remove('hidden');
    
    introSection.classList.add('hidden');

    setupGame();
    
    }});

aiButton.addEventListener('click', () => {
    if (aiGame.classList.contains('hidden')) {
        aiGame.classList.remove('hidden');

    introSection.classList.add('hidden');

    setupGameVsAi();
}})

reset.addEventListener('click', () => {
    console.log("Reset button clicked");
    resetGame();
});

resetAI.addEventListener('click', () => {
    console.log("Reset button clicked");
    resetGame();
});

function resetGame() {
    console.log("Resetting game..."); // Debugging statement
    gridArray.forEach(item => {
        item.style.backgroundColor = '#ffffff';
        item.style.backgroundImage = '';
    });
}


// Function to check for a winner
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return gridArray[a].style.backgroundColor !== 'rgb(255, 255, 255)' &&
            gridArray[a].style.backgroundColor === gridArray[b].style.backgroundColor &&
            gridArray[a].style.backgroundColor === gridArray[c].style.backgroundColor;
    });
}

// Function to check for a draw
function checkDraw() {
    return gridArray.every(item => item.style.backgroundColor !== 'rgb(255, 255, 255)') && !checkWinner();
}

// Function to initialize game setup
function setupGame() {
    function makeGame(player1Name, player2Name) {
        player1 = { color: 'blue', name: player1Name, image: 'images/x.png' };
        player2 = { color: 'pink', name: player2Name, image: 'images/o.png' };

        currentPlayer = player1.color;
        updateCurrentPlayerDisplay();

        // Function to handle a grid item click
        function handleGridItemClick(event) {
            if (event.target.style.backgroundColor === 'rgb(255, 255, 255)' || event.target.style.backgroundColor === '' || event.target.style.backgroundColor === 'transparent') {
                event.target.style.backgroundColor = currentPlayer;
                event.target.style.backgroundImage = `url(${currentPlayer === player1.color ? player1.image : player2.image})`

                if (checkWinner()) {
                    setTimeout(() => {
                        alert(`${currentPlayer === player1.color ? player1.name : player2.name} wins!`);
                        resetGame();
                    }, 500);
                } else if (checkDraw()) {
                    setTimeout(() => {
                        alert("It's a draw");
                        resetGame();
                    }, 500);
                } else {
                    currentPlayer = currentPlayer === player1.color ? player2.color : player1.color;
                    updateCurrentPlayerDisplay();
                }
            }
        }

        function updateCurrentPlayerDisplay() {
            if (!player1 || !player2) {
                return;
            }
        
            if (currentPlayer === player1.color) {
                currentPlayerDisplay.textContent = `${player1.name}'s turn`;
            } else {
                currentPlayerDisplay.textContent = `${player2.name}'s turn`;
        
            }
        }

        // Attach click event listeners to grid items
        gridItems.forEach(item => {
            item.removeEventListener('click', handleGridItemClick); // Remove old listener
            item.addEventListener('click', handleGridItemClick);
        });
    }

    // Event listener for the start button
    start.addEventListener('click', () => {
        const player1Name = player1Input.value.trim();
        const player2Name = player2Input.value.trim();

        if (!player1Name || !player2Name) {
            alert("Please fill out both names");
            return;
        }

        if (grid.classList.contains('hidden')) {
            grid.classList.remove('hidden');
        }

        resetGame(); // Reset before starting a new game
        makeGame(player1Name, player2Name);
    });

}

function setupGameVsAi() {
    function makeGameVsAi(player1NameAI, aiName) {
        player1 = { color: 'blue', name: player1NameAI, image: 'images/x.png' };
        player2 = { color: 'pink', name: aiName, image: 'images/o.png' };

        currentPlayer = player1.color;
        updateCurrentPlayerDisplayAI();

        function handleGridItemClick(event) {
            if (event.target.style.backgroundColor === 'rgb(255, 255, 255)' || event.target.style.backgroundColor === '' || event.target.style.backgroundColor === 'transparent') {
                if (currentPlayer !== player1.color) return; // Prevent player from clicking during AI's turn

                event.target.style.backgroundColor = currentPlayer;
                event.target.style.backgroundImage = `url(${currentPlayer === player1.color ? player1.image : player2.image})`

                if (checkWinner()) {
                    setTimeout(() => {
                        alert(`${currentPlayer === player1.color ? player1.name : player2.name} wins!`);
                        resetGame();
                    }, 500);
                } else if (checkDraw()) {
                    setTimeout(() => {
                        alert("It's a draw");
                        resetGame();
                    }, 500);
                } else {
                    currentPlayer = currentPlayer === player1.color ? player2.color : player1.color;
                    updateCurrentPlayerDisplayAI();
                    if (currentPlayer === player2.color) {
                        setTimeout(aiMove, 200); // AI makes a move after the player
                    }
                }
            }
        }

        gridItems.forEach(item => {
            item.removeEventListener('click', handleGridItemClick); // Remove old listener
            item.addEventListener('click', handleGridItemClick);
        });

        function aiMove() {
            let bestScore = -Infinity;
            let move;
            let possibleMoves = []; // add randommness

            gridArray.forEach((item, index) => {
                if (item.style.backgroundColor === 'rgb(255, 255, 255)' || item.style.backgroundColor === '' || item.style.backgroundColor === 'transparent') {
                    item.style.backgroundColor = player2.color; // ai's temporary move
                    let score = minimax(gridArray, 0, false);
                    item.style.backgroundColor = '#ffffff'; // undo move
                    if (score > bestScore) {
                        bestScore = score;
                        move = index;
                        possibleMoves = [index]; // randomnness
                    } else if (score === bestScore) {
                        possibleMoves.push(index); // add to possible moves
                    }
                }
            });
            
            if (possibleMoves.length > 0) {
                move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]; // pick random move
            }

            gridArray[move].style.backgroundColor = player2.color;
            gridArray[move].style.backgroundImage = `url(${player2.image})`; 
            
            if (checkWinner()) {
                setTimeout(() => {
                    alert(`${player2.name} wins!`);
                    resetGame();
                    if (currentPlayer === player2.color) {
                        setTimeout(aiMove, 200); // AI makes its move after 200 ms delay
                    }
                }, 300);
            } else if (checkDraw()) {
                setTimeout(() => {
                    alert("It's a draw");
                    resetGame();
                    if (currentPlayer === player2.color) {
                        setTimeout(aiMove, 200); // AI makes its move after 200 ms delay
                    }
                }, 300);
            } else {
                currentPlayer = player1.color;
                updateCurrentPlayerDisplayAI();
            }
        }

        function minimax(newBoard, depth, isMaximizing) {
            if (depth > 3) return 0; // return 0 depth to make AI easier;
            if (checkWinner()) return isMaximizing ? -1 : 1;
            if (checkDraw()) return 0;

            let bestScore = isMaximizing ? -1: 1; 
            gridArray.forEach((item, index) => {
                if (item.style.backgroundColor === 'rgb(255, 255, 255)' || item.style.backgroundColor === '' || item.style.backgroundColor === 'transparent') {
                    item.style.backgroundColor = isMaximizing ? player2.color : player1.color;
                    let score = minimax(gridArray, depth + 1, !isMaximizing);
                    item.style.backgroundColor = '#ffffff';
                    bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
                }
            });
            return bestScore;
        }

        function updateCurrentPlayerDisplayAI() {
            if (!player1 || !player2) {
                return;
            }
        
            if (currentPlayer === player1.color) {
                currentPlayerDisplayAI.textContent = `${player1.name}'s turn`;
            } else {
                currentPlayerDisplayAI.textContent = `${player2.name}'s turn`;
        
            }
        }

    }

    startAI.addEventListener('click', () => {
        const player1NameAI = player1InputAI.value.trim();
        const aiName = aiInput.value.trim();

        if (!player1NameAI || !aiName) {
            alert("Please fill out both names");
            return;
        }

        if (grid.classList.contains('hidden')) {
            grid.classList.remove('hidden');
        }

        resetGame(); 
        makeGameVsAi(player1NameAI, aiName);
    })
}

