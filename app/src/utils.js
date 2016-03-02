import most, {mergeArray, zip} from 'most';
import React, {Component} from 'react';

most.Stream.prototype.let = function (func) {
    return func(this);
};

const update = (initValue, patterns) => {
    const streams = patterns.filter((_, i) => i % 2 === 0);
    const callbacks = patterns.filter((_, i) => i % 2 !== 0);

    return mergeArray(streams.map((stream, index) => {
        return Array.isArray(stream)
            ? zip((...values) => prev => callbacks[index](prev, ...values), ...stream)
            : stream.map(values => prev => callbacks[index](prev, ...values))
    })).scan((prev, f) => f(prev), initValue).multicast();
};

const streamable = (store, transformer = x => x) => {
    return OriginalComponent => class extends Component {
        constructor(props) {
            super(props);
        }
        componentWillMount() {
            store.getStream().let(transformer).observe(data => {
                this.setState({data});
            });
        }
        render() {
            return <OriginalComponent {...this.state} dispatch={store.dispatch}/>
        }
    }
};

export {
    update,
    streamable
}