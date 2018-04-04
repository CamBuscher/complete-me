class Node {
  constructor(value = null) {
    this.value = value;
    this.children = {};
    this.completeWord = null;
  }
}

module.exports = {
  Node
}