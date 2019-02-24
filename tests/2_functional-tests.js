/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const { suite, test, suiteSetup, suiteTeardown, setup, teardown } = require('mocha');
const uuid4 = require('uuid/v4');

const server = require('../server');
const Book = require('../models/Book');
const assert = chai.assert;

chai.use(chaiHttp);

// helper function to write:
// saveBook, deleteBook

const _saveBook = (book, done) => { 
  let b = new Book(book);
  b.save()
    .then(res => {
      console.log('book saved to db');
      done();
    })
    .catch(err => {
      console.error(err);
      done();
    });
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

    suiteSetup(done => {
      // arrange 
      const expected = {
        title: 'Zero to One',
        _id: uuid4()        
      };

      _saveBook(expected, done);
    });

    suite('POST /api/books with title => create book object/expect book object', () => {
      
      test('Test POST /api/books with title');
      
      test('Test POST /api/books with no title given');
      
    });

    suite('GET /api/books => array of books', () => {    

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

      test('Test DELETE /api/books', done => {
        // arrange
        const expectedStatus = 204;
        const expectedMessage = 'complete delete successful';
        
        // act
        chai.request(server)
        .delete('/api/books')
        .end((err, res) => {
          // assert
          assert.equal(res.status, expectedStatus);
          assert.equal(res.body, expectedMessage);

          done();
        });
      });
    });

    suite('GET /api/books/[id] => book object with [id]', () => {
      // arrange 
      let expectedId = uuid4();
      const expected = {
        title: 'test2',
        _id: expectedId
      };

      suiteSetup(done => {        
        _saveBook(expected, done);
      });

      test('Test GET /api/books/[id] with id not in db', done => {
        // arrange
        const expectedStatus = 404;
        const notExistingId = uuid4();
        const expectedMessage = 'no book exists';
        
        // act 
        chai.request(server)
          .get(`/api/books/${notExistingId}`)
          .end((err, res) => {
            // assert 
            assert.equal(res.status, expectedStatus);
            assert.equal(res.body, expectedMessage);

            done();
          });

      });
      
      test('Test GET /api/books/[id] with valid id in db', done => {
        // arrange
        const expectedStatus = 200;
        const expectedCommentCount = 0;
        
        // act 
        chai.request(server)
          .get(`/api/books/${expected._id}`)
          .end((err, res) => {
            const actualStatus = res.status;
            const actualBody = res.body;
            
            // assert 
            assert.equal(actualStatus, expectedStatus);
            assert.propertyVal(actualBody, '_id', expected._id);
            assert.propertyVal(actualBody, 'title', expected.title);
            assert.propertyVal(actualBody, 'commentcount', expectedCommentCount);

            done();
          });
      });
      
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', () => {
      
      test('Test POST /api/books/[id] with comment');
      
    });

    suite('DELETE /api/books/[id] => delete book with [id]', () => {
      // arrange
      let expectedId = uuid4();
      const expected = {
        title: 'testDeleteBook',
        _id: expectedId
      };

      suiteSetup(done => {
        _saveBook(expected, done);
      });

      test('Test DELETE /api/books/[id]', done => {
        // arrange 
        const expectedStatus = 204;
        const expectedMessage = 'delete successful';

        // act 
        chai.request(server)
          .delete(`/api/books/${expected._id}`)
          .end((err, res) => {            
            // assert
            assert.equal(res.status, expectedStatus);
            assert.equal(res.body, expectedMessage);

            done();
          });
      });
    });

    suiteTeardown(() => {
      Book.remove({}, err => {});
    });
  });

});
