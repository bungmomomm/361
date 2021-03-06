import React, { PureComponent } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import Image from '../Image';
import Svg from '../Svg';
import Button from '../Button';
import Level from '../Level';
import Badge from '../Badge';
import styles from './card.scss';
import { Link } from 'react-router-dom';
import { trimString, aspectRatioHeight } from '@/utils';

class LovelistGrid extends PureComponent {

	makeAspectRatio = () => {
		const offsetWidth = document.getElementsByClassName('switch-wrapper')[0].offsetWidth;
		const rectContainer = _.chain(offsetWidth).divide(2)
			.subtract(21) // threshold padding
			.value();
		return {
			width: `${rectContainer}px`,
			height: `${aspectRatioHeight(rectContainer)}px`
		};
	}

	render() {
		const { className, data, isLoved, linkToPdp, lovelistDisabled } = this.props;
		const loveIcon = (isLoved) ? 'ico_love-filled.svg' : 'ico_lovelist.svg';
		const createClassName = classNames(styles.container, styles.grid, className);
		const loveListEmpty = classNames(styles.imgWrapper, styles.lovelistEmpty);

		const basePrice = data.pricing.discount !== '' && data.pricing.discount !== '0%' ? (
			<div className={styles.discount}>{data.pricing.formatted.base_price}</div>
		) : '';

		const discountBadge = ((Number(data.pricing.discount) !== 0 || data.pricing.discount !== '') || data.pricing.discount !== '0%') ? (
			<Level.Right>
				<Badge rounded color='red'>
					<span>{data.pricing.discount}</span>
				</Badge>
			</Level.Right>
		) : '';

		return (
			<div className={createClassName}>
				<Link to={linkToPdp || '/'} style={this.makeAspectRatio()} className={styles.imgContainer}>
					{(data.stock === 0) &&
						<div style={this.makeAspectRatio()} className={`${loveListEmpty} placeholder-image`}>
							<Image lazyload src={data.images[0].thumbnail} alt={data.product_title} />
						</div>
					}
					{(data.stock > 0) &&
						<div style={this.makeAspectRatio()} className={`${styles.imgWrapper} placeholder-image`}>
							<Image lazyload src={data.images[0].thumbnail} alt={data.product_title} />
						</div>
					}
				</Link>
				<Level className={styles.action}>
					<Level.Item>
						<Link to={linkToPdp || '/'}>
							<div className={styles.title}>
								<span className='font-color--primary-ext-1'>{trimString(data.product_title)}</span>
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
