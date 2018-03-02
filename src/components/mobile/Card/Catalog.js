import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Image from '../Image';
import Svg from '../Svg';
import Carousel from '../Carousel';
import Button from '../Button';
import Level from '../Level';
import Badge from '../Badge';
import styles from './card.scss';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Catalog extends PureComponent {
	render() {
		const {
			className,
			type,
			images,
			productTitle,
			brandName,
			pricing,
			commentUrl,
			commentTotal,
			linkToPdp,
			lovelistTotal,
			lovelistStatus,
			lovelistAddTo,
			lovelistDisable,
			...props
		} = this.props;

		const createClassName = classNames(styles.container, styles[type], className);
		const lovelistIcon = lovelistStatus && lovelistStatus === 1 ? 'ico_love-filled.svg' : 'ico_love.svg';

		const discountBadge = pricing.discount !== '0%' ? (
			<div style={{ marginLeft: '1.5rem' }}>
				<Badge rounded color='red'>
					<span className='font--lato-bold'>{pricing.discount}</span>
				</Badge>
			</div>
		) : '';

		const basePrice = pricing.discount !== '0%' ? (
			<div className={styles.discount}>{pricing.formatted.base_price}</div>
		) : '';

		return (
			<div className={createClassName} {...props}>
				<Link to={linkToPdp}>
					<Carousel>
						{
							images.map((image, index) => (
								<Image key={index} src={image.thumbnail} alt={productTitle} />
							))
						}
					</Carousel>
				</Link>
				<Level
					className={styles.action}
					style={{ borderBottom: '1px solid #D8D8D8' }}
				>
					<Level.Item>
						<Button onClick={lovelistAddTo} disabled={lovelistDisable}>
							<Svg src={lovelistIcon} />
							<span>{lovelistTotal} Suka</span>
						</Button>
					</Level.Item>
					<Level.Item>
						<Link to={(commentUrl) || '/'}>
							<Button wide>
								<Svg src='ico_comment.svg' />
								<span>{commentTotal} Komentar</span>
							</Button>
						</Link>
					</Level.Item>
				</Level>
				<Link to={(linkToPdp) || '/'}>
					<div className={styles.title}>
						{brandName} - <span>{productTitle}</span>
					</div>
					<Level className={styles.footer}>
						<Level.Item>
							<div className={styles.blockPrice}>
								<div>
									<div className={styles.price}>{pricing.formatted.effective_price}</div>
									{basePrice}
								</div>
								{discountBadge}
							</div>
						</Level.Item>
						<Level.Right>&nbsp;</Level.Right>
					</Level>
				</Link>
			</div>
		);
	}
}

Catalog.defaultProps = {
	linkToPdp: '/',
	commentTotal: 0,
	lovelistTotal: 0
};

Catalog.propTypes = {
	brandName: PropTypes.string,
	linkToPdp: PropTypes.string.isRequired
};

export default Catalog;
