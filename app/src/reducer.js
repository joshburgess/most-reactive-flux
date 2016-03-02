 import add from 'ramda/src/add';
 import subtract from 'ramda/src/subtract';
 import always from 'ramda/src/always';

 import { INCREMENT_COUNTER, INCREMENT_MANY_COUNTER, DECREMENT_COUNTER, DECREMENT_MANY_COUNTER, RESET_COUNTER } from './constants';

 export default {
     [DECREMENT_MANY_COUNTER]: (x, y, z) => x - y - z,
     [DECREMENT_COUNTER]: subtract, // ~ (x, y) => x - y
     [INCREMENT_COUNTER]: add, // ~ (x, y) => x + y
     [INCREMENT_MANY_COUNTER]: (x, y, z) => x + y + z,
     [RESET_COUNTER]: always(0) // ~ x => 0
 };