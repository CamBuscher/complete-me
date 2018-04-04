const chai = require('chai');
const assert = chai.assert;
const {Node} = require('../scripts/node.js')

describe('Node', () => {
  it('should hold whatever value is passed into it', () => {
    let node = new Node('cool value');

    assert.equal(node.value, 'cool value')
  });

  it('should have a value of null if not given a value', () => {
    let node = new Node();

    assert.equal(node.value, null)
  })

  it('should have an empty children object when instantiated', () => {
    let node = new Node('cool value');

    assert.deepEqual(node.children, {})
  })
})
