import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';
import { spring, AnimatedSwitch } from 'react-router-transition';
import routes from './routes';

class CustomRoute extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;
	}
	componentWillMount() {
		window.mmLoading.play();
	}
	render() {
		const { ...props } = this.props;
		return <Route {...props} />;
	}
}

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
	<div className='full-height'>
		<AnimatedSwitch
			atEnter={transition.atEnter}
			atLeave={transition.atLeave}
			atActive={transition.atActive}
			mapStyles={mapStyles}
			className='switch-wrapper'
		>
			{ routes.parent.map((route, i) => (
				<CustomRoute {...route} key={`parent-${i}`} />
			))}
		</AnimatedSwitch>
	</div>
);
