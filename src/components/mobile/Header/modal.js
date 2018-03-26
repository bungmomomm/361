import React, { Component } from 'react';
import styles from './header.scss';
import classNames from 'classnames';

class Modal extends Component {
	constructor(props) {
		super(props);
		this.props = this.props;
	}
	render() {
		const renderRow = this.props.rows && this.props.rows.length > 0;
		const containerClass = classNames(
			styles.container,
			this.props.className,
			this.props.disableShadow ? styles.disableShadow : null,
			this.props.transparent ? styles.transparent : null
		);
		const modalClass = classNames(
			styles.modal,
			renderRow ? styles.rows : null,
			this.props.transparent ? styles.transparent : null
		);
		const subHeader = () => {
			let CompHeader = null;

			if (!Array.isArray(this.props.rows)) { // backward Array compability
				CompHeader = this.props.rows;
			} else {
				CompHeader = this.props.rows.map((row, i) => (
					<div key={i} className={styles.row} ref={this.props.headerRef}>
						<div className={styles.left}>{row.left}</div>
						<div className={`${styles.center} font--lato-regular`}>{row.center}</div>
						<div className={styles.right}>{row.right}</div>
					</div>
				));
			}

			if (!CompHeader) return null;

			return (
				<div style={this.props.subHeaderStyle || {}} className={styles.subHeaderWrapper}>
					<div className={styles.subHeader}>
						{CompHeader}
					</div>
				</div>
			);
		};

		return (
			<nav className={containerClass}>
				<div className={styles.wrapper} >
					<div style={this.props.style} className={modalClass}>
						<div className='flex-row flex-spaceBetween flex-middle'>
							<div className={styles.left}>{this.props.left}</div>
							<div className={`${styles.center} font--lato-regular font-15`}>{this.props.center}</div>
							<div className={styles.right}>{this.props.right}</div>
						</div>
					</div>
				</div>
				{subHeader()}
			</nav>
		);
	}

};

export default Modal;
