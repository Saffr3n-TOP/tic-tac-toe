// @ts-check

const Gameboard = (() => {
  const GAMEBOARD_WIDTH = 3;
  const WIN_CONDITIONS = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8]
  ];

  /** @type {Array<string | undefined>} */
  let gameboard = new Array(GAMEBOARD_WIDTH ** 2);

  const get = () => {
    return [...gameboard];
  };

  /** @param {number} index */
  const getCell = (index) => {
    return gameboard[index];
  };

  /**
   * @param {number} index
   * @param {string} mark
   */
  const setCell = (index, mark) => {
    if (gameboard[index]) return;
    gameboard[index] = mark;
  };

  const reset = () => {
    gameboard = new Array(GAMEBOARD_WIDTH ** 2);
  };

  const getWinner = () => {
    for (let condition of WIN_CONDITIONS) {
      /** @type {Array<string | undefined>} */
      const cells = new Array(GAMEBOARD_WIDTH);

      for (let i = 0; i < condition.length; i++) {
        cells[i] = gameboard[condition[i]];
      }

      const winnerMark = cells.reduce((prevCell, currCell) => {
        if (!currCell || currCell !== prevCell) return;
        return currCell;
      });

      if (winnerMark) return { mark: winnerMark, condition };
    }
  };

  const gameIsOver = () => {
    if (!gameboard.includes(undefined) || getWinner()) return true;
    return false;
  };

  return {
    get,
    getCell,
    setCell,
    reset,
    getWinner,
    gameIsOver
  };
})();

/** @param {string} mark */
const Player = (mark) => {
  let score = 0;

  const getScore = () => score;
  const addScore = () => score++;

  return { mark, getScore, addScore };
};

((gameboard) => {
  const gameboardEl = /** @type {HTMLDivElement} */ (
    document.querySelector('.gameboard')
  );

  for (let i = 0; i < gameboard.length; i++) {
    const cellEl = document.createElement('div');
    cellEl.classList.add('cell');
    cellEl.setAttribute('data-index', i.toString());
    gameboardEl.appendChild(cellEl);
  }
})(Gameboard.get());

(() => {
  let gamesPlayed = 0;

  const infoEl = /** @type {HTMLDivElement} */ (
    document.querySelector('.info')
  );
  const startBtn = /** @type {HTMLButtonElement} */ (
    document.querySelector('.start-btn')
  );
  const reloadBtn = /** @type {HTMLButtonElement} */ (
    document.querySelector('.reload-btn')
  );

  const playerX = Player('X');
  const playerO = Player('O');

  const playRound = () => {
    let movesMade = 0;

    /** @type {NodeListOf<HTMLDivElement>} */
    const cellEls = document.querySelectorAll('.cell');
    const xEl = /** @type {HTMLSpanElement} */ (infoEl.firstElementChild);
    const oEl = /** @type {HTMLSpanElement} */ (infoEl.lastElementChild);

    const playerOne = gamesPlayed % 2 ? playerO : playerX;
    const playerTwo = gamesPlayed % 2 ? playerX : playerO;

    /** @param {MouseEvent} e */
    const cellClickHandler = (e) => {
      const cellEl = /** @type {HTMLDivElement} */ (e.currentTarget);
      const cellElIndexAttr = cellEl.getAttribute('data-index');

      if (!cellElIndexAttr) return;

      const cellIndex = +cellElIndexAttr;

      if (Gameboard.getCell(cellIndex)) return;

      const mark = movesMade % 2 ? playerTwo.mark : playerOne.mark;

      if (xEl.textContent === mark) {
        xEl.style.color = 'inherit';
        oEl.style.color = 'orange';
      } else {
        xEl.style.color = 'orange';
        oEl.style.color = 'inherit';
      }

      Gameboard.setCell(cellIndex, mark);
      cellEl.textContent = mark;
      movesMade++;

      if (Gameboard.gameIsOver()) {
        const winner = Gameboard.getWinner();

        xEl.style.color = 'inherit';
        oEl.style.color = 'inherit';

        cellEls.forEach((el) => {
          el.classList.remove('clickable');
          el.removeEventListener('click', cellClickHandler);

          startBtn.disabled = false;
        });

        gamesPlayed++;

        if (!winner) return;

        const playerXScoreEl = /** @type {HTMLSpanElement} */ (
          document.querySelector('.score-x')
        );
        const playerOScoreEl = /** @type {HTMLSpanElement} */ (
          document.querySelector('.score-o')
        );

        if (winner.mark === playerX.mark) playerX.addScore();
        if (winner.mark === playerO.mark) playerO.addScore();

        playerXScoreEl.textContent = playerX.getScore().toString();
        playerXScoreEl.style.color =
          playerX.getScore() > playerO.getScore() ? 'lime' : 'inherit';

        playerOScoreEl.textContent = playerO.getScore().toString();
        playerOScoreEl.style.color =
          playerO.getScore() > playerX.getScore() ? 'lime' : 'inherit';
      }
    };

    if (gamesPlayed % 2) {
      xEl.style.color = 'inherit';
      oEl.style.color = 'orange';
    } else {
      xEl.style.color = 'orange';
      oEl.style.color = 'inherit';
    }

    Gameboard.reset();

    cellEls.forEach((el) => {
      el.classList.add('clickable');
      el.addEventListener('click', cellClickHandler);
      el.textContent = '';
    });
  };

  startBtn.addEventListener('click', () => {
    startBtn.disabled = true;
    playRound();
  });

  reloadBtn.addEventListener('click', () => {
    window.location.reload();
  });
})();
