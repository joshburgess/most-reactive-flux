import React, {Component} from 'react';
import {render} from 'react-dom';

import {Map, List} from 'immutable';

import createStore from './src/createStore';
import reducer from './src/reducer';
import {streamable} from './src/utils';
import {INCREMENT_COUNTER, INCREMENT_MANY_COUNTER,
    DECREMENT_COUNTER, DECREMENT_MANY_COUNTER, RESET_COUNTER, UNDO_COUNTER, REDO_COUNTER, REMOVE_HISTORY} from './src/constants';

const store = createStore(reducer, new Promise(resolver => {
    setTimeout(resolver.bind(resolver, Map({counter: 42, history: List(), future: List()})), 500);
}));

// We can use it like a decorator or usual approach like
// Counter = streamable(store, x => x.map(_ => `Item => ${_}`))(Counter) || Counter;

@streamable(store)
class Counter extends Component {
    render() {
        const {dispatch, data} = this.props;
        return <div>
            {data && <div>
                <div>
                    <button disabled={data.get('history').size < 1} className="btn btn-success" onClick={() => dispatch(UNDO_COUNTER)}>Undo</button>
                    &nbsp;
                    <button disabled={data.get('future').size < 1} className="btn btn-success" onClick={() => dispatch(REDO_COUNTER)}>Redo</button>
                    &nbsp;
                    <div className="btn btn-success" onClick={() => dispatch(REMOVE_HISTORY)}>Clear history</div>
                </div>
                <br />
                <button className="btn btn-danger" onClick={() => dispatch(DECREMENT_MANY_COUNTER, ...[1, 2])}>Click -1 and -2</button>
                &nbsp;
                <button className="btn btn-danger" onClick={() => dispatch(DECREMENT_COUNTER, 1)}>Click -1</button>
                &nbsp;
                <span>{!!data ? data.get('counter') : 0}</span>
                &nbsp;
                <button className="btn btn-info" onClick={() => dispatch(INCREMENT_COUNTER, 1)}>Click +1</button>
                &nbsp;
                <button className="btn btn-info" onClick={() => dispatch(INCREMENT_MANY_COUNTER, ...[1, 2])}>Click +1 and +2</button>
                &nbsp;
                <button className="btn btn-success" onClick={() => dispatch(RESET_COUNTER)}>Reset</button>
            </div>}
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