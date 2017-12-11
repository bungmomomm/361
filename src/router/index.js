import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { isMobile } from '@/utils';

// import routes from './routes';
import routesMobile from './routes.mobile';

export default () => (
	<Switch>
		{
			isMobile() ? (
				// redirect to Mobile Route
				routesMobile.map((route, i) => <Route {...route} key={i} />)
			) : (
				// redirect to Desktop Route
				// routes.map((route, i) => <Route {...route} key={i} />)
				routesMobile.map((route, i) => <Route {...route} key={i} />)
			)
		}
	</Switch>
);	