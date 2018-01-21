import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './navigation.scss';
import Svg from '../Svg';

class Item extends PureComponent {
	render() {
		const createClassName = classNames(
			styles.item,
			{
				[styles.active]: this.props.active
			},
		);

		return (
			<a href={this.props.to} className={createClassName}>
				<Svg src={this.props.icon} />
				<span className={styles.label}>{this.props.label}</span>
			</a>
		);
	}
}

export default Item;
