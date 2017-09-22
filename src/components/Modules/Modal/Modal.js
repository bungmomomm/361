import React, { Component } from 'react';
import TransitionGroup from 'react-addons-transition-group';
import { isMobile } from '@/utils';

import ModalMobile from './Modal.mobile';
import ModalDesktop from './Modal.desktop';

import Header from './__child/ModalHeader';
import Body from './__child/ModalBody';
import Footer from './__child/ModalFooter';

export default class Modal extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.show !== nextProps.show) {
			document.body.style.overflow = nextProps.show ? 'hidden' : '';
		}
	}
	render() {
		return (
			isMobile() ? (
				<TransitionGroup>
					{
						this.props.show && <ModalMobile {...this.props} />
					}
				</TransitionGroup>
			) : (
				<ModalDesktop {...this.props} />
			)
		);
	}
};

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;