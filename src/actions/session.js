/*In react-redux, reducers produce the state of the application
	while actions like the ones defined below are how the reducers know when
	to produce the next state. Redux actions are javascript objects
	and each action is associated with a type and the state that needs
	to be updated. The type property is a string that the reducers use
	to determine how to calculate the next state and the corresponding
	state is changed. Action types are declared as constants below.*/

export const FETCH_SESSION = 'FETCH_SESSION';
export const SAVE_QUESTIONS = 'SAVE_QUESTIONS';

/*This is the action for getting sessions and updates sessions state.*/
export function fetchSessions (sessions) {
    return {
        type: FETCH_SESSION,
        sessions
    }
}
/*This is the action for saving questions and updates the questions state.*/
export function saveQuestions (questions) {
    return {
        type: SAVE_QUESTIONS,
        questions
    }
}
