// Reference translation for key press to expected action
const keyDict = {
  a: { player: 'small1', type: 'movement', action: 'left' },
  w: { player: 'small1', type: 'movement', action: 'up' },
  d: { player: 'small1', type: 'movement', action: 'right' },
  s: { player: 'small1', type: 'movement', action: 'down' },
  g: { player: 'small2', type: 'movement', action: 'left' },
  y: { player: 'small2', type: 'movement', action: 'up' },
  j: { player: 'small2', type: 'movement', action: 'right' },
  h: { player: 'small2', type: 'movement', action: 'down' },
  ArrowLeft: {
    player: 'big',
    type: 'movement',
    action: 'left'
  },
  ArrowUp: { player: 'big', type: 'movement', action: 'up' },
  ArrowRight: {
    player: 'big',
    type: 'movement',
    action: 'right'
  },
  ArrowDown: {
    player: 'big',
    type: 'movement',
    action: 'down'
  }
};

export default keyDict;
