const chai = require('chai');
const assert = chai.assert;
const {Trie} = require('../scripts/trie.js')
const {Node} = require('../scripts/node.js')
import fs from 'fs';
const text = "/usr/share/dict/words"
const dictionary = fs.readFileSync(text).toString().trim().split('\n')

describe('Trie', () => {
  
  let tree;
    beforeEach(()=> {
      tree = new Trie()  
  })

  it('should have a root of a blank node', () => {
    let node = new Node();

    assert.deepEqual(tree.root, node)
  })

  it('should have an array to store suggested words', () => {
    assert.deepEqual(tree.suggestions, [])
  })

  it('should have a property called count that starts at zero and keeps track of words', () => {
    assert.equal(tree.count, 0)
  })

  describe('Insert', () => {

    it('should take a word and make corresponding nodes', () => {
      tree.insert('test')

      assert.isNotNull(tree.root.children.t.children.e.children.s.children.t,
        'the tree root has a child of t, which has a child of e, etc.')
    })

    it('should mark a completed word at the final node', () => {
      tree.insert('oh')

      assert.equal(tree.root.children.o.children.h.completeWord.word, 'oh')
    })

    it('should not create additional nodes after word is complete', () => {
      tree.insert('oh')

      assert.deepEqual(tree.root.children.o.children.h.children, {})
    })

    it('should increase word count upon receiving new word', () => {
      assert.equal(tree.count, 0)
      tree.insert('spaghetti')
      assert.equal(tree.count, 1)
    })

    it('should not increase word count upon reveiving duplicate', () => {
      assert.equal(tree.count, 0)
      tree.insert('spaghetti')
      tree.insert('spaghetti')
      assert.equal(tree.count, 1)
    })
  })

  describe('Suggest', () => {

    beforeEach(()=> {
      tree.insert('chamomile')
      tree.insert('chameleon')
      tree.insert('charizard')
      tree.insert('chapstik')
      tree.insert('charmander')
      tree.insert('chap')
    })

    it('should return an array of suggestions based on given string', () => {
      let array = tree.suggest('cha')
      assert.equal(array.length, 6)
    })

    it('should store most recent suggestions in tree', () => {
      tree.suggest('cha')
      assert.equal(tree.suggestions.length, 6)
    })

    it('should return an empty array if nothing matches given string', () => {
      let array = tree.suggest('cat')
      assert.deepEqual(tree.suggestions, [])
    })

    it('should work despite capitalization of given string', () => {
      let array = tree.suggest('cHaM')
      assert.equal(array.length, 2)
    })

    it('should not suggest the word if word is completed already', () => {
      tree.suggest('chamomile')
      assert.notInclude(tree.suggestions, 'chamomile', 'chamomile is not included')
    })

  })

  describe('Populate', () => {
    it('should fill a tree with all words from the dictionary', () => {
      tree.populate(dictionary)
      assert.equal(tree.count, 234371)
    })

  })

  describe('Delete', () => {
    it('should remove a completed word from trie', () => {
      tree.populate(dictionary)
      tree.suggest('zebra')

      assert.deepEqual(tree.suggestions, [ 'zebraic', 'zebralike', 'zebrass', 'zebrawood' ])

      tree.delete('zebrawood')
      tree.suggest('zebra')

      assert.deepEqual(tree.suggestions, [ 'zebraic', 'zebralike', 'zebrass' ])
    })

    it('should decrease the word count', () => {
      tree.populate(dictionary)
      assert.equal(tree.count, 234371)

      tree.delete('zebrawood')
      assert.equal(tree.count, 234370)
    })

    it('should not decrease word count if word doesn\'t exist', () => {
      tree.populate(dictionary)
      assert.equal(tree.count, 234371)

      tree.delete('OnyxIsAGoodDog')
      assert.equal(tree.count, 234371)
    })
  })

  describe('Select', () => {

    beforeEach(()=> {
      tree.insert('chamomile')
      tree.insert('chameleon')
      tree.insert('charizard')
      tree.insert('chapstik')
      tree.insert('charmander')
      tree.insert('chap')
    })

    it('should allow the suggest function to prioritize previously selected words', () => {
      tree.suggest('cha')
      assert.equal(tree.suggestions[0], 'chamomile')

      tree.select('charmander')
      tree.suggest('cha')
      assert.equal(tree.suggestions[0], 'charmander')
    })

    it('should increment the timesChosen attribute on correct node indefinitely', () => {
      tree.insert('hi')
      for (var i = 0; i < 1000; i++) {
        tree.select('hi')
      }
      assert.equal(tree.root.children.h.children.i.completeWord.timesChosen, 1000)
    })

    it('should prioritize words that have been selected more than other selected words', () => {
      tree.select('charmander')
      tree.select('charmander')
      tree.select('chamomile')

      tree.suggest('cha')
      assert.equal(tree.suggestions[0], 'charmander')
    })

    it('should remember how many times a word has been chosen if deleted then re-inserted', () => {
      tree.insert('hi')
      tree.select('hi')
      tree.select('hi')
      tree.delete('hi')

      tree.insert('hi')

      assert.equal(tree.root.children.h.children.i.completeWord.timesChosen, 2)
    })
  })
})