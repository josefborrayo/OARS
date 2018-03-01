import {
    FETCH_FORM,
    UPDATE_STATS,
    SAVE_QUESTIONS
} from '../actions/types';

const initialState = {
	forms: null,
	questions: null,
	stats: null
};

export function form (state = initialState, action) {
    switch(action.type) {
        case FETCH_FORM:
          return Object.assign({}, state, {
            forms: {...action.forms}
          });
        case SAVE_QUESTIONS:
          return Object.assign({}, state, {
            questions: {...action.questions}
          });
        case UPDATE_STATS:
          return Object.assign({}, state, {
            stats: {...action.stats}
          });
        default:
          return state
    }
}
