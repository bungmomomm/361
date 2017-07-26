import React, { Component } from 'react';
import styles from './Modal.scss';
import classNames from 'classnames/bind';
import Icon from '@/components/Icon';
const cx = classNames.bind(styles);

export default class Modal extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			displayModal: this.props.shown ? this.props.shown : false
		};
		this.handleClose = this.handleClose.bind(this);
	}
	
	componentWillMount() {
		document.body.style.overflow = 'hidden';
	}

	handleClose() {
		this.setState({
			displayModal: false
		});
		document.body.style.overflow = 'auto';
	}
	

	render() {
		const ModalClass = cx({
			Modal: true
		});

		const ModalWrapperClass = cx({
			wrapper: true,
			large: !!this.props.large
		});
		return (
			this.state.displayModal ? (
				<div className={ModalClass}>
					<div className={ModalWrapperClass}>
						{this.props.children}
						<button onClick={this.handleClose} className={styles.close}>
							<Icon name='times' />
						</button>
					</div>
					<div className={styles.overlay} />
				</div>
			) : null
		);
	}
};

class Header extends Modal {
	render() {
		const ItemClass = cx({
			Header: true
		});
		return (
			<div className={ItemClass}>
				{this.props.children}
			</div>
		);
	}
};
class Body extends Modal {
	render() {
		const BodyClass = cx({
			body: true
		});
		return (
			<div className={BodyClass}>
				{this.props.children}
			</div>
		);
	}
};

class Footer extends Modal {
	render() {
		const FooterClass = cx({
			Footer: true
		});
		return (
			<div className={FooterClass}>
				{this.props.children}
			</div>
		);
	}
};


Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;