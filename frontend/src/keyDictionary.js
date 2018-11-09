// Reference translation for key press to expected action
const keyDict = {
  // a: { player: 'playerSmall1', type: 'movement', action: 'left' },
  // w: { player: 'playerSmall1', type: 'movement', action: 'up' },
  // d: { player: 'playerSmall1', type: 'movement', action: 'right' },
  // s: { player: 'playerSmall1', type: 'movement', action: 'down' },
  // g: { player: 'playerSmall2', type: 'movement', action: 'left' },
  // y: { player: 'playerSmall2', type: 'movement', action: 'up' },
  // j: { player: 'playerSmall2', type: 'movement', action: 'right' },
  // h: { player: 'playerSmall2', type: 'movement', action: 'down' },
  ArrowLeft: {
    // player: 'playerBig',
    type: 'movement',
    action: 'left'
  },
  ArrowUp: {
    // player: 'playerBig',
    type: 'movement',
    action: 'up'
  },
  ArrowRight: {
    // player: 'playerBig',
    type: 'movement',
    action: 'right'
  },
  ArrowDown: {
    // player: 'playerBig',
    type: 'movement',
    action: 'down'
  }
};

export default keyDict;
