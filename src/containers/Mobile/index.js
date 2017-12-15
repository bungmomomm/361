import React, { Component } from 'react';
import styles from './mobile.scss';

import { Image } from '@/components';

import { Container } from 'mm-ui';

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
			<div className={styles.checkout}>
				<div className={styles.header}>
					<Container>
						<a href='/'>
							<Image src='mobile/logo-mm.png' alt='logo mataharimall' />
						</a>
					</Container>
				</div>
				<Container className={styles.checkoutWrapper}>
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
					<div className={[styles.cardPayment].join(' ').trim()}>
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
				</Container>
			</div>
		);
	}
}

export default Mobile;