import compose from 'ramda/src/compose';
import reduce from 'ramda/src/reduce';
import keys from 'ramda/src/keys';
import cond from 'ramda/src/cond';
import is from 'ramda/src/is';
import prop from 'ramda/src/prop';
import identity from 'ramda/src/identity';
import isArrayLike from 'ramda/src/isArrayLike';
import T from 'ramda/src/T';

import {of, from, fromPromise} from 'most';
import {holdSubject} from 'most-subject';

import {update} from './utils';

export default (reducer, initialValue) => {
    const actions = compose(reduce((acc, name) => acc.set(name, holdSubject()), new Map()), keys)(reducer);
    const patterns = reduce((acc, [key, {observer, stream}]) => acc.concat(stream, reducer[key]), [], actions);

    const initialStream = cond([
        [compose(is(Function), prop('then')), fromPromise],
        [compose(is(Function), prop('observe')), identity],
        [isArrayLike, from],
        [T, of]
    ])(initialValue);

    return {
        getStream: () => initialStream.concatMap(v => update(v, patterns)),
        dispatch: (actionName, ...payload) => actions.get(actionName).observer.next(payload)
    }
};