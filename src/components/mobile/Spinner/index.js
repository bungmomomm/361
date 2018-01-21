import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './spinner.scss';

class Spinner extends PureComponent {
	render() {
		const className = classNames(
			this.props.className,
			styles[this.props.type],
			styles[this.props.size]
		);

		switch (this.props.type) {
		case 'wave':
			return (
				<div className={className}>
					<div className={styles.stick} />
					<div className={styles.stick} />
					<div className={styles.stick} />
					<div className={styles.stick} />
					<div className={styles.stick} />
				</div>
			);

		case 'dotted':
			return (
				<div className={className}>
					<div className={styles.dot} />
					<div className={styles.dot} />
					<div className={styles.dot} />
				</div>
			);

		case 'round':
		default:
			return (
				<svg viewBox='0 0 50 50' className={className}>
					<circle
						className={styles.path}
						cx='25'
						cy='25'
						r='20'
						fill='none'
						strokeMiterlimit='10'
					/>
				</svg>
			);
		}
	}
}

Spinner.defaultProps = {
	type: 'round',
	size: 'small'
};


export default Spinner;
