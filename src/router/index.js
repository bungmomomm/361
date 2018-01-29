import React from 'react';
import { Route } from 'react-router-dom';
import { spring, AnimatedSwitch, AnimatedRoute } from 'react-router-transition';
import routes from './routes';
import ProfileEdit from '@/containers/Mobile/Users/Profile';

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
	<div>
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
		<AnimatedRoute
			path='/profile/edit'
			component={ProfileEdit}
			atEnter={{ offset: -100 }}
			atLeave={{ offset: -100 }}
			atActive={{ offset: 0 }}
			mapStyles={(styles) => ({
				transform: `translateX(${styles.offset}%)`,
			})}
		/>
	</div>
);
