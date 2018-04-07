class Node {
  constructor(value = null) {
    this.value = value;
    this.children = {};
    this.completeWord = {
      timesChosen: 0,
      word: null
    };
  }
}

module.exports = {
  Node,
};
