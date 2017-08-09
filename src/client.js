import React from 'react';
import { render } from 'react-dom';
import { createStore, compose, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import reducers from '@/reducers';
import { CookiesProvider } from 'react-cookie';

const Router = require('react-router-dom')[process.env.STATIC ? 'HashRouter' : 'BrowserRouter'];

/**
 * Use redux thunk for use promise
 * instead of object in action creator
 */

// eslint-disable-next-line
const initialState = window.__REDUX_STATE__;

const store = process.env.NODE_ENV === 'development' ? 
	createStore(reducers, initialState, composeWithDevTools(
		applyMiddleware(thunkMiddleware)
	)) : 
	createStore(reducers, initialState, compose(
		applyMiddleware(thunkMiddleware)
	)); 

/**
 * Require main styles
 */

require('@/styles');

/**
 * Render App component
 */

const renderComponent = () => {

	const App = require('@/containers/App');

	return (

		<Provider store={store}>
			<CookiesProvider>
				<Router>
					<App />
				</Router>
			</CookiesProvider>	
		</Provider>

	);
	
};

/**
 * Render App on first client render
 */
render(renderComponent(), document.getElementById('root'));

/**
 * Enable HMR on App and Reducers
 */

if (module.hot) {
	
	module.hot.accept('@/containers/App', () => render(renderComponent(), document.getElementById('root')));
	module.hot.accept('@/reducers', () => store.replaceReducer(require('@/reducers')));

};