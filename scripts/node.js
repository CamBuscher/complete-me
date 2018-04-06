class Node {
  constructor(value = null) {
    this.value = value;
    this.children = {};
    this.completeWord = {
      word: null,
      timesChosen: 0,
    };
  }
}

module.exports = {
  Node,
};
