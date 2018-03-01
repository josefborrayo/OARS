import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';

//css
import jquery from 'jquery'

window.jQuery = jquery
window.$ = jquery
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
import CreateForm from './components/secure/CreateForm'
import Dashboard from './components/secure/Dashboard'

const reducer = combineReducers({
	...reducers,
	routing: routerReducer
});

//noinspection JSUnresolvedVariable
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
	reducer,
	composeEnhancers(applyMiddleware(routerMiddleware(browserHistory)))
);

const history = syncHistoryWithStore(browserHistory, store);

const secure = requireAuth(store);


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
				<Route path='createform' component={CreateForm} onEnter={secure}/>
				<Route path='dashboard' component={Dashboard}/>
			</Route>
		</Router>
	</Provider>,
	document.getElementById('root')
);
