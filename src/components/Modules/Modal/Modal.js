import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../Elements/Icon';
import { injectProps } from '@/decorators';
import { renderIf } from '@/utils';

import Header from './ModalHeader';
import Body from './ModalBody';
import Footer from './ModalFooter';

import styles from './Modal.scss';
import classNames from 'classnames/bind';
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

	componentWillReceiveProps(nextProps) {
		if (this.state.displayModal !== nextProps.shown) {
			this.setState({
				displayModal: nextProps.shown
			});
			document.body.style.overflow = nextProps.shown ? 'hidden' : '';
		}
	}

	handleClose() {
		this.setState({
			displayModal: false
		});
		if (this.props.onClose) {
			this.props.onClose(true);
		}
		document.body.style.overflow = '';
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
			renderIf(this.state.displayModal)(
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
	small: PropTypes.bool
};