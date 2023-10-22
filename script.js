// @ts-check

const Gameboard = (() => {
  const GAMEBOARD_WIDTH = 3;
  const GAMEBOARD_CELLS_AMOUNT = GAMEBOARD_WIDTH ** 2;

  /** @type {Array<string | undefined>} */
  const gameboard = new Array(GAMEBOARD_CELLS_AMOUNT);

  const getGameboard = () => {
    return [...gameboard];
  };

  /**
   * @param {number} index
   * @param {string} mark
   */
  const setGameboardCell = (index, mark) => {
    if (gameboard[index]) return;
    gameboard[index] = mark;
  };

  return { getGameboard, setGameboardCell };
})();

/**
 * @param {string} name
 * @param {string} mark
 */
const Player = (name, mark) => {
  return { name, mark };
};

((gameboard) => {
  /** @type {HTMLDivElement | null} */
  const gameboardEl = document.querySelector('.gameboard');

  for (let i = 0; i < gameboard.length; i++) {
    const gameboardCellEl = document.createElement('div');
    gameboardCellEl.classList.add('cell');
    gameboardCellEl.textContent = i % 2 === 0 ? 'O' : 'X';
    gameboardEl?.appendChild(gameboardCellEl);
  }
})(Gameboard.getGameboard());
