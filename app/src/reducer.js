 import add from 'ramda/src/add';
 import subtract from 'ramda/src/subtract';
 import always from 'ramda/src/always';

 import {List} from 'immutable';

 import { INCREMENT_COUNTER, INCREMENT_MANY_COUNTER,
     DECREMENT_COUNTER, DECREMENT_MANY_COUNTER, RESET_COUNTER, UNDO_COUNTER, REDO_COUNTER, REMOVE_HISTORY } from './constants';
 
 export default {
     [DECREMENT_MANY_COUNTER]: (x, y, z) => {
         x = x.update('history', history => history.push(x.get('counter')));
         x = x.update('counter', v => v - y - z);

         return x;
     },
     [DECREMENT_COUNTER]: (x, y) => {
         x = x.update('history', history => history.push(x.get('counter')));
         x = x.update('counter', v => v - y);

         return x;
     },//subtract, // ~ (x, y) => x - y
     [INCREMENT_COUNTER]: (x, y) => {
         x = x.update('history', history => history.push(x.get('counter')));
         x = x.update('counter', v => v + y);

         return x;
     },//add, // ~ (x, y) => x + y
     [INCREMENT_MANY_COUNTER]: (x, y, z) => {
         x = x.update('history', history => history.push(x.get('counter')));
         x = x.update('counter', v => v + y + z);

         return x;
     },
     [RESET_COUNTER]: x => {
         x = x.update('history', history => history.push(x.get('counter')));
         x = x.set('counter', 0);

         return x;
     },//always(0) // ~ x => 0,
     [UNDO_COUNTER]: x => {
         if(x.get('history').size < 1) return x;
         else {
             const temp = x.get('history').last();
             x = x.update('history', history => history.pop());
             x = x.update('future', future => future.push(x.get('counter')));

             return x.set('counter', temp);
         }
     },
     [REDO_COUNTER]: x => {
         if(x.get('future').size < 1) return x;
         else {
             const temp = x.get('future').last();
             x = x.update('history', history => history.push(x.get('counter')));
             x = x.update('future', future => future.pop());

             return x.set('counter', temp);
         }
     },
     [REMOVE_HISTORY]: x => {
         x = x.set('history', List());
         x = x.set('future', List());
         
         return x;
     }
 };