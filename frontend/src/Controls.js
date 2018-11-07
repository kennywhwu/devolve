document.addEventListener('keyup', e => {
  // $(document).keydown(e => {
  switch (e.which) {
    //Player 1 controls
    case 65: //left
      console.log('left player 1');
      break;

    case 87: // up
      console.log('up player 1');
      break;

    case 68: // right
      console.log('right player 1');
      break;

    case 83: // down
      console.log('down player 1');
      break;

    //Player 2 controls
    case 37: //left
      console.log('left player 2');
      break;

    case 38: // up
      console.log('up player 2');
      break;

    case 39: // right
      console.log('right player 2');
      break;

    case 40: // down
      console.log('down player 2');
      break;

    default:
      return; // exit this handler for other keys
  }
  e.preventDefault();
});
