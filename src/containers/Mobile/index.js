import React, { Component } from 'react';
import styles from './mobile.scss';

import { Image, CheckoutHeader } from '@/components';

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
			isMobile: false,
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

	componentWillMount() {
		this.updateDimensions();
		window.addEventListener('resize', () => this.updateDimensions());
	}

	componentWillUnmount() {
		window.removeEventListener('resize', () => this.updateDimensions());
	}

	updateDimensions() {
		this.setState({ isMobile: window.innerWidth <= 768 || false });
	}

	applyState(data) {
		this.setState({ ...data });
	}

	render() {
		return (
			<div className={styles.checkout}>
				<div className={styles.header}>
					{
						this.state.isMobile ? (
							<Container>
								<a href='/'>
									<Image src='mobile/logo-mm.png' alt='logo mataharimall' />
								</a>
							</Container>
						) : <CheckoutHeader />
					}
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