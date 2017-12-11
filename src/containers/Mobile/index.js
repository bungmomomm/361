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
				disabled: false,
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
				disabled: false,
			},
			stepThree: {
				disabled: false,
			},
			stepFour: {
				disabled: false,
				payNowButton: false
			}
		};
	}

	applyState(data) {
		this.setState({ ...data });
	}

	render() {
		return (
			<div className='checkout'>
				<div className={styles.header}>
					<a href='/'>
						<Image src='mobile/logo-mm.png' alt='logo mataharimall' />
					</a>
				</div>
				<div className='checkout-wrapper'>
					<StepOne 
						applyState={(e) => this.applyState(e)} 
						stepState={this.state}
					/>
					{
						<StepTwo 
							applyState={(e) => this.applyState(e)} 
							stepState={this.state} 
							disabled={this.state.stepTwo.disabled}
						/>
					}
					<div className='card-payment'>
						<StepThree 
							applyState={(e) => this.applyState(e)} 
							stepState={this.state} 
							disabled={this.state.stepThree.disabled}
						/>
						<StepFour 
							applyState={(e) => this.applyState(e)} 
							stepState={this.state} 
							disabled={this.state.stepFour.disabled}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default Mobile;