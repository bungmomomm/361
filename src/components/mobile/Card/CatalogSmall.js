import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Image from '../Image';
import Button from '../Button';
import styles from './card.scss';
import { Link } from 'react-router-dom';
class CatalogSmall extends PureComponent {
	render() {
		const {
			className,
			images,
			pricing,
			linkToPdp,
			...props
		} = this.props;

		const createClassName = classNames(styles.container, styles.small, className);

		return (
			<div className={createClassName} {...props}>
				<Link to={(linkToPdp) || '/'} className={styles.imgContainer}>
					<div className={styles.imgWrapper}>
						<Image src={images[0].thumbnail} alt='product' />
					</div>
					<Button color='secondary' size='small' transparent>{pricing.formatted.effective_price}</Button>
				</Link>
			</div>
		);
	}
}

export default CatalogSmall;
