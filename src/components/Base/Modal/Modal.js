import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectProps } from '@/decorators';
import styles from './Modal.scss';
import classNames from 'classnames/bind';
import Icon from '@/components/Icon';

import Header from './ModalHeader';
import Body from './ModalBody';
import Footer from './ModalFooter';

const cx = classNames.bind(styles);

export default class Modal extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			displayModal: this.props.shown || false
		};
		this.handleClose = this.handleClose.bind(this);
	}
	
	componentWillMount() {
		this.toggleBodyOverflow();
	}

	handleClose() {
		this.setState({
			displayModal: false
		});
		this.toggleBodyOverflow();
	}

	toggleBodyOverflow() {
		document.body.style.overflow = this.state.displayModal ? 'auto' : 'hidden';
	}
	
	@injectProps
	render({
		large,
		small,
		children
	}) {
		const ModalClass = cx({
			Modal: true
		});

		const ModalWrapperClass = cx({
			wrapper: true,
			large: !!large,
			small: !!small
		});
		return (
			!this.state.displayModal ? null : (
				<div className={ModalClass}>
					<div className={ModalWrapperClass}>
						{children}
						<button 
							onClick={this.handleClose} 
							className={styles.close}
						>
							<Icon name='times' />
						</button>
					</div>
					<div 
						onClick={this.handleClose} 
						aria-pressed='false' 
						tabIndex='0' 
						role='button' 
						className={styles.overlay} 
					/>
				</div>
			)
		);
	}
};

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

Modal.propTypes = {
	shown: PropTypes.bool,
	large: PropTypes.bool,
	small: PropTypes.bool,
	children: PropTypes.node
};