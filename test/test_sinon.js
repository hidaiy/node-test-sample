const assert = require('assert');
const sinon = require('sinon');
const request = require('request-promise');


function once(fn) {
    let returnValue, called = false;
    return function () {
        if (!called) {
            called = true;
            returnValue = fn.apply(this, arguments);
        }
        return returnValue;
    };
}

// spy
// callback関数が呼ばれたかどうかを調べられる。
// なんの引数で呼ばれたかを調べる。
describe('spy', function () {
    it('無名関数の場合', function () {
        let callback = sinon.spy(); //新規に作るコールバックの場合
        let proxy = once(callback);

        proxy();
        proxy();

        assert(callback.called);
        assert(callback.calledOnce);
    });
    it('関数が呼ばれたかどうかを調べる場合', function () {
        function callback() {
            // console.log('callback')
        }

        let cb = sinon.spy(callback); //新規に作るコールバックの場合
        let proxy = once(cb);

        proxy();
        proxy();

        assert(cb.called);
        assert(cb.calledOnce);
    });
    it('メソッドが呼ばれたかどうかを調べる場合', function () {
        let obj = {
            doSomething: function () {
                // console.log('callback in method')
            }
        };

        let cb = sinon.spy(obj.doSomething); //新規に作るコールバックの場合
        let proxy = once(cb);

        proxy();
        proxy();

        assert(cb.called);
        assert(cb.calledOnce);
    });

    it('何の引数で呼ばれたかを調べる場合', function () {
        let callback = sinon.spy(); //新規に作るコールバックの場合
        let proxy = once(callback);

        proxy(1,2,3);

        assert(callback.called);

        let spyCall = callback.getCall(0);
        // 1つずつ引数の中身を確認したい場合
        assert.equal(spyCall.args[0], 1);
        assert.equal(spyCall.args[1], 2);
        assert.equal(spyCall.args[2], 3);

        // or

        assert(spyCall.calledWith(1,2,3));
    });

    it('何の引数で呼ばれたかを調べる場合(シンプルな書き方)', function () {
        let callback = sinon.spy(); //新規に作るコールバックの場合
        let proxy = once(callback);

        proxy(1,2,3);

        assert(callback.calledWith(1,2,3));
    });
});

// stub
// spyの全ての機能を満たし、スタブの機能を持つ
// メソッドを特定の値を返すメソッドに置き換える。

describe('stub', function () {
    it('callback', function () {
        let callback = sinon.stub().returns(42); // 固定の値を返す関数を作る
        let proxy = once(callback);

        assert.equal(proxy(), 42);
        assert(callback.calledOnce); // spyの機能も持っている。
    });
});

// stubを繰り返し設定する場合、テストのたびに、stub設定をリセットする
describe('stub2', function () {
    let client = {
        _request: request,
        getTodos: async function getTodos(listId) {
            return client._request('http://localhost:3000/todo/' + listId + '/items')
        }
    };

    afterEach(function () {
        client._request.restore();// stubの設定を解除する。
    });

    it('async', async function () {
        sinon.stub(client, '_request').returns(new Promise((resolve, reject) => {
            resolve([{id: 1, todo: "テストを書く"}, {id: 2, todo: "テストを書く2"}])
        }));
        let result = await client.getTodos(42);
        assert(client._request.calledWith('http://localhost:3000/todo/42/items'));
        assert.deepEqual(result, [{id: 1, todo: "テストを書く"}, {id: 2, todo: "テストを書く2"}])
    });

    it('async Promiseを返す場合の簡単な書き方', async function () {
        sinon.stub(client, '_request').resolves( // 同様にrejectsを使えば処理失敗の場合もテストできる
            [{id: 1, todo: "テストを書く"}, {id: 2, todo: "テストを書く2"}]
        );
        let result = await client.getTodos(100);
        assert(client._request.calledWith('http://localhost:3000/todo/100/items'));
        assert.deepEqual(result, [{id: 1, todo: "テストを書く"}, {id: 2, todo: "テストを書く2"}])
    });
});



describe("指定したコールバックの実行", function () {
    var callback = sinon.stub();
    callback(function () {
        return true;
    }, function () {
        return false;
    });

    it('1を指定した場合、2個目のコールバックが実行される', function () {
        assert.equal(callback.callArg(1), false); // Logs "Oh noes!"
    });
});

describe('getterをstubで変更する', function () {
    let myObj = {
        prop: 'foo'
    };

    it('プロパティがbarにになっている', function () {
        sinon.stub(myObj, 'prop').get(function getterFn() {
            return 'bar';
        });
        assert.equal(myObj.prop, 'bar'); // 'bar'
    });

});

describe('propertyをsutbで変更する', function () {
    var myObj = {
        example: 'oldValue',
    };
    it('プロパティを参照するとnewValueが帰る', function () {
        sinon.stub(myObj, 'example').value('newValue');
        assert.equal(myObj.example, 'newValue'); // 'newValue'
    });
});





// mock
// spyとstubの機能を併せ持ち、コード実行前に、メソッドが何回呼ばれるかといった設定ができる。
// 期待した通りにメソッドが動作していない場合、その場で落ちるように、メソッド実行前に設定する仕組み。
// メソッドが何度実行されたか細かくチェックする必要がない場合、spyやstubを使う。
describe('mock', function () {
    it('spy + stub', function () {
        let callback = sinon.mock().returns(42); // 固定の値を返す関数を作る
        let proxy = once(callback);

        assert.equal(proxy(), 42); // mock的な機能の確認
        assert(callback.calledOnce); // spyのように関数が呼ばれたかどうかを確認。
    });
    it('spy + stub', function () {
        let callback = sinon.mock().returns(42); // 固定の値を返す関数を作る
        let proxy = once(callback);

        assert.equal(proxy(), 42); // mock的な機能の確認
        assert(callback.calledOnce); // spyのように関数が呼ばれたかどうかを確認。
    });


    function proxy(fn) {
        try {
            return fn()
        } catch(e) {
            return e
        }
    }

    it("test should call all subscribers when exceptions", function () {
        let myAPI = { method: function () {} };
        let spy = sinon.spy();
        let mock = sinon.mock(myAPI);
        mock.expects("method").atLeast(1).throws();

        proxy(myAPI.method);
        proxy(spy);

        mock.verify();
        assert(spy.calledOnce);
    });

});
