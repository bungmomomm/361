import React, { Component } from 'react';
import { TweenMax, Power4 } from 'gsap';
import Icon from '../../Elements/Icon';
import classNames from 'classnames/bind';
import styles from './Modal.mobile.scss';
const cx = classNames.bind(styles);

export default class ModalMobile extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.handleClose = this.handleClose.bind(this);
	}

	componentWillMount() {
		window.scrollTo(0, 0);
		if (this.props.ref) this.props.ref(this.container);
	}

	componentWillEnter(callback) {
		const el = this.container;
		TweenMax.fromTo(el, 0.5, { 
			y: `${parseInt(el.clientHeight, 10)}` 
		}, { 
			y: 0, 
			ease: Power4.easeOut, 
			onComplete: callback 
		});
	}

	componentWillLeave(callback) {
		const el = this.container;
		TweenMax.fromTo(el, 0.3, { 
			y: 0 
		}, { 
			y: `${parseInt(el.clientHeight, 10)}`, 
			ease: Power4.easeIn, 
			onComplete: callback 
		});
	}

	handleClose() {
		this.props.handleClose();
	}
	
	render() {
		const ModalClass = cx({
			modalWrapper: true,
			[`${this.props.className}`]: !!this.props.className,
			[`${this.props.variant}`]: !!this.props.variant,
			disableOverflow: this.props.disableOverflow,
		});

		return (
			<div ref={c => { this.container = c; }} className={ModalClass}>
				{this.props.children}
				<button 
					onClick={this.handleClose} 
					className={styles.close}
				>
					<Icon name='times' />
				</button>
			</div>
		);
	}
}