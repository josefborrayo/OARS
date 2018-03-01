import {
    FETCH_FORM,
    UPDATE_STATS,
    SAVE_QUESTIONS
} from './types';
export function fetchForm (forms) {
    return {
        type: FETCH_FORM,
        forms
    }
}

export function saveQuestions (questions) {
    return {
        type: SAVE_QUESTIONS,
        questions
    }
}

export function updateStats (totalUserTests, totalTests) {
    return {
        type: UPDATE_STATS,
        stats: {
          totalUserTests,
          totalTests
        }
    }
}