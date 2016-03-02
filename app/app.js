import React, {Component} from 'react';
import {render} from 'react-dom';

import createStore from './src/createStore';
import reducer from './src/reducer';
import {streamable} from './src/utils';
import {INCREMENT_COUNTER, INCREMENT_MANY_COUNTER, DECREMENT_COUNTER, DECREMENT_MANY_COUNTER, RESET_COUNTER} from './src/constants';

const store = createStore(reducer, new Promise(resolver => {
    setTimeout(resolver.bind(resolver, 42), 500);
}));

// We can use it like a decorator or usual approach like
// Counter = streamable(store, x => x.map(_ => `Item => ${_}`))(Counter) || Counter;

@streamable(store, x => x.map(_ => `Item => ${_}`))
class Counter extends Component {
    render() {
        const {dispatch, data} = this.props;
        return <div>
            <button className="btn btn-danger" onClick={() => dispatch(DECREMENT_MANY_COUNTER, ...[1, 2])}>Click -1 and -2</button>
            &nbsp;
            <button className="btn btn-danger" onClick={() => dispatch(DECREMENT_COUNTER, 1)}>Click -1</button>
            &nbsp;
            <span>{!!data ? data : 0}</span>
            &nbsp;
            <button className="btn btn-info" onClick={() => dispatch(INCREMENT_COUNTER, 1)}>Click +1</button>
            &nbsp;
            <button className="btn btn-info" onClick={() => dispatch(INCREMENT_MANY_COUNTER, ...[1, 2])}>Click +1 and +2</button>
            &nbsp;
            <button className="btn btn-success" onClick={() => dispatch(RESET_COUNTER)}>Reset</button>
        </div>
    }
}

class App extends Component {
    render() {
        return (<div>
                    <Counter />
                    <br />
                    <Counter />
                    <br />
                    <Counter />
                    <br />
                    <Counter />
        </div>);
    }
}


render(<App />, document.getElementById('app'));