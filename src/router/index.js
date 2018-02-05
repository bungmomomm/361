import React from 'react';
import { Route } from 'react-router-dom';
import { spring, AnimatedSwitch } from 'react-router-transition';
import routes from './routes';

function mapStyles(styles) {
	return {
		opacity: styles.opacity
	};
}

function bounce(val) {
	return spring(val, {
		stiffness: 330,
		damping: 22,
	});
}

const transition = {
	atEnter: {
		opacity: 0
	},
	atLeave: {
		opacity: bounce(0)
	},
	atActive: {
		opacity: bounce(1)
	},
};

export default () => (
	<AnimatedSwitch
		atEnter={transition.atEnter}
		atLeave={transition.atLeave}
		atActive={transition.atActive}
		mapStyles={mapStyles}
		className='switch-wrapper'
	>
		{
			routes.map((route, i) => <Route {...route} key={i} />)
		}
	</AnimatedSwitch>
);
