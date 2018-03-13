import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './assets/css/main.css'
import './assets/css/sidebar.css'
import './assets/css/tests.css'
import 'react-rangeslider/lib/index.css'

//libraries
import { requireAuth } from './utils/secure';
import * as reducers from './reducers'

// components
import App from './components/App'
import Home from './components/Home'
import Login from './components/auth/Login'
import Logout from './components/auth/Logout'
import PendingSessions from './components/secure/PendingSessions'
import SessionPage_PatientInfo from './components/secure/SessionPage_PatientInfo'
import Settings from './components/secure/Settings'
import CompletedSessions from './components/secure/CompletedSessions'
import CreateSession from './components/secure/CreateSession'
import Dashboard from './components/secure/Dashboard'
import Help from './components/secure/Help'

//Routing for the application is handled in this component.

const reducer = combineReducers({
	...reducers,
	routing: routerReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/*Using the reducer and composeEnhancers constants defined above,
the redux store is created which stores the state of the application
and by using reducers and actions, predefined state variables can
be shared across components.*/
const store = createStore(
	reducer,
	composeEnhancers(applyMiddleware(routerMiddleware(browserHistory)))
);

/*This constant handles browser session history.*/
const history = syncHistoryWithStore(browserHistory, store);

/*This constant checks for user authentication when
a page is navigated to. The requireAuth function is located
in the secure.js file.*/
const secure = requireAuth(store);

/*This where routing for each component is handled. The onEnter
event handler calls the secure constant to check user authentication
*/
ReactDOM.render(
	<Provider store={store}>
		<Router history={history}>
			<Route path='/' component={App}>
				<IndexRoute component={Home}/>
				<Route path='login' component={Home}/>
				<Route path='register' component={Home}/>
				<Route path='logout' component={Logout}/>
				<Route path='pending_sessions' component={PendingSessions} onEnter={secure}/>
				<Route path='test/:id' component={SessionPage_PatientInfo} onEnter={secure}/>
				<Route path='settings' component={Settings} onEnter={secure}/>
				<Route path='completed_sessions' component={CompletedSessions}  onEnter={secure}/>
				<Route path='create_session' component={CreateSession} onEnter={secure}/>
				<Route path='dashboard' component={Dashboard}/>
				<Route path='help' component={Help} onEnter={secure}/>
			</Route>
		</Router>
	</Provider>,
	document.getElementById('root')
);
