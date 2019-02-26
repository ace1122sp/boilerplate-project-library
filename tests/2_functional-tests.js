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
};

const _saveManyBooks = (books, done) => {
  Book.create(books)
    .then(books => {
      console.log('books saved to db');
      done();
    })
    .catch(err => {
      console.error(err);
      done();
    });
}

const _deleteBook = (prop, query, done) => {
  Book.findByIdAndDelete({ [prop]: query }, (err, res) => {
    if (err) {
      console.error();
      done();
    } else {
      console.log('delete from db successful');
      done();
    }
  });
}

suite('Functional Tests', () => {

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
      // arrange      
      const expected = {
        title: 'post book title',
        _id: uuid4()
      };

      test('Test POST /api/books with title', done => {
        // arrange      
        const expectedStatus = 201;
        const expectedCommentCount = 0;
        
        // act
        chai.request(server)
          .post('/api/books')
          .send(expected)
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
      
      test('Test POST /api/books with no title given', done => {
        // arrange 
        const expectedStatus = 400;
        
        // act
        chai.request(server)
        .post('/api/books')
        .end((err, res) => {
          // assert 
          assert.equal(res.status, expectedStatus);
          
          done();
        });
      });
      
      suiteTeardown(done => {
        _deleteBook('title', expected.title, done);
      });
    });

    suite('GET /api/books => array of books', () => {    
      // arrange
      const expected = {
        _id: uuid4(),
        title: 'test title'        
      }

      setup(done => {
        _saveBook(expected, done);
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
      
      teardown(done => {
        _deleteBook('title', expected.title, done);
      });
      
    });

    suite('DELETE /api/books => delete all books', () => {
      // arrange
      const testBook1 = {
        title: 'test book 1',
        _id: uuid4()
      };

      const testBook2 = {
        title: 'test book 2',
        _id: uuid4()
      };

      setup(done => {
        _saveManyBooks([testBook1, testBook2], done);
      });

      test('Test DELETE /api/books', done => {
        // arrange
        const expectedStatus = 200;
        const expectedMessage = 'complete delete successful';
        
        // act
        chai.request(server)
        .delete('/api/books')
        .end((err, res) => {
          // assert
          console.log(res.text);
          assert.equal(res.status, expectedStatus);
          assert.equal(res.text, expectedMessage);

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
            assert.equal(res.text, expectedMessage);

            done();
          });

      });
      
      test('Test GET /api/books/[id] with valid id in db', done => {
        // arrange
        const expectedStatus = 200;
        
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
            assert.isArray(actualBody.comments, 'comments property should be an array');

            done();
          });
      });
      
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', () => {
      // arrange
      const testBook = {
        _id: uuid4(),
        title: 'test title'
      };

      suiteSetup(done => {
        _saveBook(testBook, done);
      });

      test('Test POST /api/books/[id] with comment', done => {
        // arrange
        const expectedStatus = 201;
        const expectedComment = 'test comment';

        // act
        chai.request(server)
          .post(`/api/books/${testBook._id}`)
          .send({ comment: expectedComment })
          .end((err, res) => {
            const actual = res.body;

            // assert
            assert.equal(res.status, expectedStatus);
            assert.equal(actual.comments.length, 1);
            assert.equal(actual.comments[0], expectedComment);

            done();
          });
      });
      
      suiteTeardown(done => {
        _deleteBook('_id', testBook._id, done);
      });
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
        const expectedStatus = 200;
        const expectedMessage = 'delete successful';

        // act 
        chai.request(server)
          .delete(`/api/books/${expected._id}`)
          .end((err, res) => {            
            // assert
            assert.equal(res.status, expectedStatus);
            assert.equal(res.text, expectedMessage);

            done();
          });
      });
    });

    suiteTeardown(() => {
      Book.deleteMany({}, err => {})
        .then(() => {
          console.log('end of functional tests');
          process.exit(0);
        })
        .catch(err => {}); // to handle
    });
  });
});