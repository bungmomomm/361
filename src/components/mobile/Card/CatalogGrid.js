import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import Image from '../Image';
import Svg from '../Svg';
import Button from '../Button';
import Level from '../Level';
import Badge from '../Badge';
import styles from './card.scss';

class CatalogGrid extends PureComponent {

	lovelistAddTo() {
		const { lovelistStatus, lovelistAddTo } = this.props;
		console.log('love', lovelistStatus);
		if (lovelistStatus && lovelistStatus === 1) {
			return lovelistAddTo(false);
		}
		return lovelistAddTo(true);
	}

	render() {
		const {
			className,
			images,
			productTitle,
			brandName,
			pricing,
			linkToPdp,
			lovelistStatus,
			lovelistDisable,
			lovelistAddTo,
			...props
		} = this.props;
		
		const disableLovelist = lovelistDisable && lovelistAddTo;
		const createClassName = classNames(styles.container, styles.grid, className);

		const lovelistIcon = lovelistStatus && lovelistStatus === 1 ? 'ico_love-filled.svg' : 'ico_love.svg';

		const discountBadge = pricing.discount !== '' && pricing.discount !== '0%' ? (
			<Level.Right>
				<Badge rounded color='red'>
					<span className='font--lato-bold'>{pricing.discount}</span>
				</Badge>
			</Level.Right>
		) : '';

		const basePrice = pricing.discount !== '' && pricing.discount !== '0%' ? (
			<div className={styles.discount}>{pricing.formatted.base_price}</div>
		) : '';

		return (
			<div className={createClassName} {...props}>
				<Link to={linkToPdp || '/'}>
					<Image src={images[0].thumbnail} alt={productTitle} />
				</Link>
				<Level className={styles.action}>
					<Level.Item>
						<Link to={linkToPdp || '/'}>
							<div className={styles.title}>
								{brandName}
								<span>{productTitle}</span>
							</div>
						</Link>
					</Level.Item>
					<Level.Right>
						<Button onClick={(e) => this.lovelistAddTo()} disabled={disableLovelist}>
							<Svg src={lovelistIcon} />
						</Button>
					</Level.Right>
				</Level>
				<Link to={linkToPdp || '/'}>
					<Level className={styles.footer}>
						<Level.Item>
							<div className={styles.blockPrice}>
								<div className={styles.price}>{pricing.formatted.effective_price}</div>
								{basePrice}
							</div>
						</Level.Item>
						{discountBadge}
					</Level>
				</Link>
			</div>
		);
	}
}

export default CatalogGrid;
