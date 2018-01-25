import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
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
			<Link to={this.props.to} className={createClassName}>
				<Svg src={this.props.icon} />
				<span className={styles.label}>{this.props.label}</span>
			</Link>
		);
	}
}

export default Item;
