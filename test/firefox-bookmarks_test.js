// Load in dependencies
var assert = require('assert');
var fs = require('fs');
var BookmarkCollection = require('../');
var BookmarkCollectionCli = require('../lib/cli');

function debugOutput(filename) {
  before(function (done) {
    if (process.env.DEBUG_TEST) {
      try { fs.mkdirSync(__dirname + '/actual-files'); } catch (e) {}
      fs.writeFile(__dirname + '/actual-files/' + filename, JSON.stringify(this.output, null, 4), done);
    } else {
      process.nextTick(done);
    }
  });
}

// TODO: Test bookmark in menu
// TODO: Test whitelisting

// Basic tests
describe('A simple set of bookmarks', function () {
  describe('parsed into `firefox-bookmarks`', function () {
    before(function () {
      // Parse the bookmarks
      var input = require(__dirname + '/test-files/simple.input.json');
      this.bookmarks = new BookmarkCollection(input);
    });

    describe('when output as JSON', function () {
      before(function () {
        this.output = this.bookmarks.toJSON();
      });
      debugOutput('simple.output.json');

      it('returns an matching array of bookmarks and folders', function () {
        // Compare actual output to expected output
        var expectedBookmarks = require(__dirname + '/expected-files/simple.output.json');
        assert.deepEqual(this.output, expectedBookmarks);
      });
    });
  });
});

describe('A nested set of bookmarks', function () {
  before(function () {
    this.inputPath = __dirname + '/test-files/nested.input.json';
  });

  describe('parsed into `firefox-bookmarks`', function () {
    before(function () {
      // Parse the bookmarks
      var input = require(this.inputPath);
      this.bookmarks = new BookmarkCollection(input);
    });

    describe('when output as JSON', function () {
      before(function () {
        this.output = this.bookmarks.toJSON();
      });
      debugOutput('nested.output.json');

      it('returns an matching array of bookmarks and folders', function () {
        // Compare actual output to expected output
        var expectedBookmarks = require(__dirname + '/expected-files/nested.output.json');
        assert.deepEqual(this.output, expectedBookmarks);
      });
    });

    describe('when flattened', function () {
      before(function () {
        this.output = this.bookmarks.flatten();
      });
      debugOutput('nested.flatten.json');

      it('returns an matching array of minimalist bookmarks', function () {
        // Compare actual output to expected output
        var expectedBookmarks = require(__dirname + '/expected-files/nested.flatten.json');
        assert.deepEqual(this.output, expectedBookmarks);
      });
    });
  });

  describe('parsed via CLI task', function () {
    before(function (done) {
      var cli = new BookmarkCollectionCli();
      var that = this;
      cli.flatten(this.inputPath, {}, function (err, json) {
        if (err) { return done(err); }
        that.output = json;
        done();
      });
    });

    debugOutput('nested.cli.json');

    it('returns an matching array of minimalist bookmarks', function () {
      // Compare actual output to expected output
      var expectedBookmarks = require(__dirname + '/expected-files/nested.flatten.json');
      assert.deepEqual(this.output, expectedBookmarks);
    });
  });
});
