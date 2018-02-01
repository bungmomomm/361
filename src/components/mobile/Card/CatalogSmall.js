import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Image from '../Image';
import Button from '../Button';
import styles from './card.scss';


class CatalogSmall extends PureComponent {
	render() {
		const {
			className,
			images,
			pricing,
			...props
		} = this.props;

		const createClassName = classNames(styles.container, styles.small, className);

		return (
			<div className={createClassName} {...props}>
				<Image src={images[0].mobile} alt='product' />
				<Button color='secondary' size='small' transparent>{pricing.formatted.effective_price}</Button>
			</div>
		);
	}
}

export default CatalogSmall;
