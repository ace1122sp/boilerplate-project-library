/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { suite, test, suiteSetup, suiteTeardown, setup, teardown } = require('mocha');
const Book = require('../models/Book');

chai.use(chaiHttp);

// helper function to write:
// saveBook, deleteBook

const _saveBook = book => { 
  let b = new Book(book);
  b.save();
}

suite('Functional Tests', () => {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test.skip('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', () => {

    suite('POST /api/books with title => create book object/expect book object', () => {
      
      test('Test POST /api/books with title');
      
      test('Test POST /api/books with no title given');
      
    });

    suite.only('GET /api/books => array of books', () => {
      
      suiteSetup(() => {
        // arrange 
        const expected = {
          title: 'Zero to One'
        };

        _saveBook(expected);
      });

      test('Test GET /api/books', done => {
        // arrange
        const expectedStatus = 200;
        const expectedProperties = ['_id', 'title', 'commentcount'];
        
        // act 
        chai.request(server)
        .get('/api/books')
        .end((err, res) => {
          const actualStatus = res.status;
          const actualResponse = res.body;
          const actualBook = res.body[0];

          // assert
          assert.equal(actualStatus, expectedStatus);
          assert.isArray(actualResponse, 'response should be an array');
          assert.property(actualBook, expectedProperties[0], 'book object should contain property _id');
          assert.property(actualBook, expectedProperties[1], 'book object should contain property title');
          assert.property(actualBook, expectedProperties[2], 'book object should contain property commentcount');
          done();
        });
      });      
      
    });

    suite('DELETE /api/books => delete all books', () => {

      test('Test DELETE /api/books ');
    });

    suite('GET /api/books/[id] => book object with [id]', () => {
      
      test('Test GET /api/books/[id] with id not in db');
      
      test('Test GET /api/books/[id] with valid id in db');
      
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', () => {
      
      test('Test POST /api/books/[id] with comment');
      
    });

    suite('DELETE /api/books/[id] => delete book with [id]', () => {
      
      test('Test DELETE /api/books/[id]');
    });

    suiteTeardown(() => {
      Book.remove({}, err => {});
    });
  });

});
