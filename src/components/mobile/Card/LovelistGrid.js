import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Image from '../Image';
import Svg from '../Svg';
import Button from '../Button';
import Level from '../Level';
import Badge from '../Badge';
import styles from './card.scss';
import { Link } from 'react-router-dom';

class LovelistGrid extends PureComponent {
	render() {
		const { className, data, isLoved, linkToPdp, lovelistDisabled } = this.props;
		const loveIcon = (isLoved) ? 'ico_love-filled.svg' : 'ico_lovelist.svg';
		const createClassName = classNames(styles.container, styles.grid, className);

		const basePrice = data.pricing.discount !== '' && data.pricing.discount !== '0%' ? (
			<div className={styles.discount}>{data.pricing.formatted.base_price}</div>
		) : '';

		const discountBadge = data.pricing.discount !== '' && data.pricing.discount !== '0%' ? (
			<Level.Right>
				<Badge rounded color='red'>
					<span className='font--lato-bold'>{data.pricing.discount}</span>
				</Badge>
			</Level.Right>
		) : '';

		return (
			<div className={createClassName}>
				<Link to={linkToPdp || '/'} className={styles.imgContainer}>
					<div className={styles.imgWrapper}>
						<Image lazyload src={data.images[0].thumbnail} alt={data.productt_title} />
					</div>
				</Link>
				<Level className={styles.action}>
					<Level.Item>
						<Link to={linkToPdp || '/'}>
							<div className={styles.title}>
								<span className='font-small text-uppercase'>{data.brand.name}</span>
								<span>{data.product_title}</span>
							</div>
						</Link>
					</Level.Item>
					<Level.Right>
						<Button onClick={this.props.onBtnLovelistClick} data-id={data.id} disabled={lovelistDisabled} >
							<Svg src={loveIcon} />
						</Button>
					</Level.Right>
				</Level>
				<Link to={linkToPdp || '/'}>
					<Level className={styles.footer}>
						<Level.Item>
							<div className={styles.blockPrice}>
								<div className={styles.price}>{data.pricing.formatted.effective_price}</div>
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

export default LovelistGrid;
