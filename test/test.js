var assert = require('assert');

let a;
let b;
before(function () {
    console.log("global before");
    a = "a";
});

after(function () {
    console.log("global after");
});


describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});

describe('index.js only mocha', function () {
    const index = require('../index');
    it('hello', function () {
        assert.equal(index.hello(), 'hello');
    });
});


const chai = require('chai');
const expect = chai.expect;
describe('index.js with chai', function () {
    const index = require('../index');
    it('hello', function () {
        expect(index.hello()).to.be.a('string');
        expect(index.hello()).to.equal('hello');
        expect(index.hello()).to.have.length(5);
        expect(index.hello()).to.equal('hello').with.length(5);
    });
});

describe('a', function () {
    it('a', function () {
        assert.equal(a, "a");
    });
});

describe('b', function () {
    before('set b', function () {
        b = "b"
    });
    it('a', function () {
        assert.equal(a, "a");
    });
    it('b', function () {
        assert.equal(b, "b");
    });
    it('b = null', function () {
        b = null;
        assert.equal(b, null);
    });
    // null に初期化されているので落ちる
    it.skip('b2', function () {
        assert.equal(b, "b");
    });
});


// beforeで非同期の処理をする場合、beforeのコールバックの引数にdone関数をとるようにする。
// 非同期処理の最後でdoneを呼び出す。
// 実際のテストでもコールバックの引数にdone関数をとる。
// 実際のテストの最後にdoneを呼び出す。
// 呼び出さなかった場合、
describe('async', function () {
    let c;
    before('set c', function (done) {
        setTimeout(function () {
            c = "c";
            done()
        }, 1000)
    });

    it('c = "c"', function (done) {
        assert.equal(c, "c");
        done();
    });
});


describe('only', function () {
    let num = 0;
    it('num - 1', function () {
        assert.equal(num, 0);
        num -= 1;
    });
    it('num', function () {
        assert.equal(num, -1);
    });
    it('num = -1', function () {
        assert.equal(num, -1);
    });
});

// retriesを使うと、失敗する可能性のあるテストをやり直すことができる。
// やり直す回数を指定する。
describe.skip('retries', function () {
    // Retry all tests in this suite up to 4 times
    this.retries(10);

    let num = 0;
    beforeEach(function () {
        num = Math.floor(Math.random() * 10)
    });
    it('should succeed on the 3rd try', function () {
        // Specify this test to only retry up to 2 times
        // this.retries(10);
        assert.equal(num, 2)
    });
});





describe('DYNAMICALLY GENERATING TEST', function () {
    function double(x) {
        return x * 2;
    }
    const testcase = [{arg: 1, expect: 2}, {arg: 4, expect: 8}];
    testcase.forEach(function (c) {
        it(`${c.arg} should be ${c.expect}`, function () {
            assert.equal(double(c.arg), c.expect);
        });
    });
});

// requireはキャッシュされるので、テスト時にrequireした値を変更する場合、
// beforeEachで初期化する。
describe('require index', function () {
    let index = require('../index');
    beforeEach(function() {
        index.name = '';
    });

    it('shoud be index.name is index1', function () {
        index.name = "index1";
        assert.equal(index.name, "index1");
    });
    it('shoud be index.name is ""', function () {
        assert.equal(index.name, "");
    });
});


