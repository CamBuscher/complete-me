const {Node} = require('../scripts/node.js')

class Trie {
  constructor() {
    this.root = new Node();
    this.count = 0;
    this.suggestions = [];
  }

  insert(word, node = this.root, arr = []) {
    word = word.toLowerCase()
    let newArr = arr;
    if (node.children[word[0]] && word.length === 1) { 

      if (node.children[word[0]].completeWord.word === null) {
        newArr.push(word[0])
        node.children[word[0]].completeWord.word = newArr.join('');
        this.count++;

      } else {
        return 'That word already exists'

      }
      
    } else if (node.children[word[0]]) {
      newArr.push(word[0])
      this.insert(word.slice(1), node.children[word[0]], newArr)
      
    } else {
      node.children[word[0]] = new Node(word[0])
      
      if (word.length === 1 && node.children[word[0]].completeWord.word === null) {
        newArr.push(word[0])
        node.children[word[0]].completeWord.word = newArr.join('');
        this.count++;
        
      } else {
        newArr.push(word[0])
        this.insert(word.slice(1), node.children[word[0]], newArr)
      }
    }
  }

  populate(arr) {
    arr.forEach(el => {
      this.insert(el)
    })
  }

  suggest(str) {
    this.suggestions = [];
    let splitStr = [...str.toLowerCase()]
    let currentNode = this.root
    for (let i = 0; i < splitStr.length; i++) {
      if (currentNode === undefined) {
        return this.suggestions
      }
      currentNode = currentNode.children[splitStr[i]]
    }
    
    this.findTheWords(currentNode)
    this.suggestions.sort((a, b) => b.timesChosen - a.timesChosen)

    this.suggestions = this.suggestions.map( ({word}) => word )
    return this.suggestions
  }
  
  findTheWords(currentNode) {
    let childrenKeys = Object.keys(currentNode.children);
    
    childrenKeys.forEach(key => {
      if (currentNode.children[key].completeWord.word) {
        this.suggestions.push(currentNode.children[key].completeWord)
        } 
      this.findTheWords(currentNode.children[key])
    })
  }

  delete(str) {
    let splitStr = [...str.toLowerCase()]
    let currentNode = this.root
    for (let i = 0; i < splitStr.length; i++) {
      if (currentNode === undefined) {
        return 'That\'s not a word.'
      }
      currentNode = currentNode.children[splitStr[i]]
    }
    if(currentNode.completeWord.word) {
      currentNode.completeWord.word = null;
      this.count--
    } else {
      return 'That\'s not a word.'
    }
  }

  select(word) {
    let splitStr = [...word.toLowerCase()]
    let currentNode = this.root
    for (let i = 0; i < splitStr.length; i++) {
      currentNode = currentNode.children[splitStr[i]]
    }
    currentNode.completeWord.timesChosen++
  }
}

module.exports = {
  Trie
}