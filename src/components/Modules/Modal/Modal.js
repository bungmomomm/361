import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../Elements/Icon';
import { injectProps } from '@/decorators';
import { renderIf } from '@/utils';

import Header from './__child/ModalHeader';
import Body from './__child/ModalBody';
import Footer from './__child/ModalFooter';

import styles from './Modal.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default class Modal extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			displayModal: this.props.shown || false,
			modal: this.props.modal || false
		};
		this.handleClose = this.handleClose.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.displayModal !== nextProps.shown) {
			this.setState({
				displayModal: nextProps.shown
			});
			document.body.style.overflow = nextProps.shown ? 'hidden' : '';
		}
	}

	handleClose() {
		if (!this.state.modal) {
			this.setState({
				displayModal: false
			});
			if (this.props.onClose) {
				this.props.onClose(true);
			}
			document.body.style.overflow = '';
		}
	}

	@injectProps
	render({
		size,
		loading,
		children
	}) {
		const ModalClass = cx({
			Modal: true,
			loading: !!loading
		});

		const ModalWrapperClass = cx({
			wrapper: true,
			[`${size}`]: !!size,
		});
		return (
			renderIf(this.state.displayModal)(
				<div className={ModalClass}>
					<div className={ModalWrapperClass} style={this.props.style}>
						{children}
						{renderIf(!this.state.modal && !this.props.disableCloseButton)(
							<button 
								onClick={this.handleClose} 
								className={styles.close}
							>
								<Icon name='times' />
							</button>
						)}
					</div>
					<div 
						onClick={!this.props.disableCloseBackground && this.handleClose} 
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
	/** Trigger show Modal. */
	shown: PropTypes.bool,
	size: PropTypes.oneOf(['small', 'medium', 'large']),
};