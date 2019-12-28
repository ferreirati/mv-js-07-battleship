import GameView from '../views/game.view';
import PlayerController from './player.controller';
import AppService from '../app.service';

const GameController = () => {
  const players = [];
  const appService = AppService();

  const shot = coords => {
    // Human player shots on the AI board
    if (players[1].board.receiveAttack(coords.x, coords.y, shot)) {
      if (!players[0].aiShot()) {
        // AI give up, game finished
      }
    } else { // Player tried to shot on an invalid cell.
      appService.message('You cannot shot the same place twice. Try again!');
    }
  };

  const startBattle = () => {
    players[1].aiPlaceShips();
    GameView.battle();
    players[0].board.battle();
    players[1].board.battle(shot);
    appService.message(`${players[0].name} place your canoons to the enemy board!`);
  };

  const startGame = () => {
    if (document.getElementById('player1').value === '') {
      appService.message('What is your name?');
    } else {
      // status = 'placingShips';
      players[0] = PlayerController(document.getElementById('player1').value);
      players[1] = PlayerController('AI');
      appService.message(`${players[0].name} place your ships on the board.`);
      GameView.renderShipsPlacement(players[0], startBattle);
    }
  };

  // Game is finished if any board have all ships sinked.
  const isFinished = () => players[0].board.allSunk() || players[1].board.allSunk();

  // Winner is the player that don't have all ships sinked.
  const getWinner = () => (players[0].board.allSunk() ? players[1] : players[0]);

  // Controller initialization
  GameView.base();
  GameView.playerName(startGame);
  appService.message('Welcome! Enter your name and click Start!');

  return { shot };
};

export default GameController;
