import React, { Component } from 'react';
import styles from './mobile.scss';

import { Image } from '@/components';

// step
import StepOne from './components/stepOne';
import StepTwo from './components/stepTwo';
import StepThree from './components/stepThree';
import StepFour from './components/stepFour';

class Mobile extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			stepOne: {
				disable: false,
				activeTab: 0,
				selectedAddress: {
					attributes: {
						isJabodetabekArea: false
					}
				},
				dropshipper: {
					validateDropshipper: false,
					validDropshipper: true,
					name: '',
					phone: '',
					checked: false,
				}
			},
			stepTwo: {
				disable: false
			},
			stepThree: {
				disable: false
			},
			stepFour: {
				disable: false
			}
		};
	}

	applyState(data) {
		this.setState({ ...data });
	}

	render() {
		return (
			<div>
				<div className={styles.header}>
					<a href='/'>
						<Image src='mobile/logo-mm.png' alt='logo mataharimall' />
					</a>
				</div>
				<StepOne 
					applyState={(e) => this.applyState(e)} 
					stepState={this.state}
				/>
				{
					!this.state.stepTwo.disable &&
					<StepTwo 
						applyState={(e) => this.applyState(e)} 
						stepState={this.state} 
					/>
				}
				{
					!this.state.stepThree.disable &&
					<StepThree 
						applyState={(e) => this.applyState(e)} 
						stepState={this.state} 
					/>
				}
				{
					!this.state.stepFour.disable &&
					<StepFour 
						applyState={(e) => this.applyState(e)} 
						stepState={this.state} 
					/>
				}
			</div>
		);
	}
}

export default Mobile;