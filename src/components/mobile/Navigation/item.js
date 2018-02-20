import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styles from './navigation.scss';
import Svg from '../Svg';
import Badge from '../Badge';

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
				<div>
					<Svg src={this.props.icon} />
					{
						this.props.badge && <Badge circle attached size='small' className='bg--red font-color--white'>{this.props.badge}</Badge>
					}
					
				</div>
				<span className={styles.label}>{this.props.label}</span>
			</Link>
		);
	}
}

export default Item;
