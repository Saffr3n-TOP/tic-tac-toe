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

/**
 * @param {string} name
 * @param {string} mark
 */
const Player = (name, mark) => {
  return { name, mark };
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
