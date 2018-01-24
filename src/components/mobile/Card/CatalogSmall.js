import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Image from '../Image';
import Button from '../Button';
import styles from './card.scss';


class CatalogSmall extends PureComponent {
	render() {
		const { className, ...props } = this.props;

		const createClassName = classNames(styles.container, styles.small, className);

		return (
			<div className={createClassName} {...props}>
				<Image local src='temp/product-1.jpg' alt='product' />
				<Button color='secondary' size='small' transparent>Rp. 1.300.000</Button>
			</div>
		);
	}
}

export default CatalogSmall;
