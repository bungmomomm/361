import React, { Component } from 'react';
import styles from './mobile.scss';

import { 
	Image
} from '@/components';

// step
import StepOne from './components/stepOne';
import StepTwo from './components/stepTwo';
import StepThree from './components/stepThree';
import StepFour from './components/stepFour';

class Mobile extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
		return (
			<div>
				<div className={styles.header}>
					<a href='/'>
						<Image src='mobile/logo-mm.png' alt='logo mataharimall' />
					</a>
				</div>
				<StepOne />
				<StepTwo />
				<StepThree />
				<StepFour />
			</div>
		);
	}
}

export default Mobile;