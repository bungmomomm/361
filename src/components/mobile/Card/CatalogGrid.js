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
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			loading: false,
			prevLoved: props.lovelistStatus ? 0 : 1,
			loved: props.lovelistStatus || 0
		};
	}

	componentWillReceiveProps(nextProps) {
		const { loading, prevLoved } = this.state;
		const { optimistic } = this.props;
		if (optimistic) {
			if (typeof nextProps.lovelistStatus !== 'undefined' && !loading) {
				this.setState({
					loved: nextProps.lovelistStatus,
					loading: false
				});
			} else if (prevLoved !== nextProps.lovelistStatus) {
				this.setState({
					loading: false
				});
			}
		}
	}

	lovelistAddTo() {
		const { loading } = this.state;
		const { lovelistStatus, lovelistAddTo, optimistic } = this.props;
		let loved = 1;
		if (lovelistStatus && lovelistStatus === 1) {
			loved = 0;
		}
		if (optimistic) {
			if (loading) {
				return;
			}
			lovelistAddTo(loved);
			this.setState({
				prevLoved: loved ? 0 : 1,
				loved,
				loading: true
			});
		} else {
			lovelistAddTo(loved);
		}
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
			love,
			optimistic,
			split,
			productOnClick,
			...props
		} = this.props;
		const { loved } = this.state;

		const disableLovelist = lovelistDisable && lovelistAddTo;
		const createClassName = classNames(styles.container, (split) ? styles.grid[`split--${split}`] : styles.grid, className);

		let lovelistIcon = lovelistStatus && lovelistStatus === 1 ? 'ico_love-filled.svg' : 'ico_love.svg';
		if (optimistic) {
			lovelistIcon = loved && loved === 1 ? 'ico_love-filled.svg' : 'ico_love.svg';
		}

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
		let loveButton = (
			<Button onClick={(e) => this.lovelistAddTo()} disabled={disableLovelist}>
				<Svg src={lovelistIcon} />
			</Button>
		);
		if (love) {
			loveButton = love;
		}
		return (
			<div className={createClassName} {...props} data-loved={lovelistStatus}>
				<Link to={linkToPdp || '/'} className={styles.imgContainer}>
					<div className={styles.imgWrapper} tabIndex='0' role='button' onClick={() => productOnClick()}>
						<Image src={images[0].thumbnail} lazyload alt={productTitle} />
					</div>
				</Link>
				<Level className={styles.action}>
					<Level.Item>
						<Link to={linkToPdp || '/'} >
							<div className={styles.title} tabIndex='0' role='button' onClick={() => productOnClick()}>
								<span className='font-small text-uppercase font--lato-bold font-color--primary'>{brandName}</span>
								<span className='text-elipsis-two-line font-color--primary-ext-2'>{productTitle}</span>
							</div>
						</Link>
					</Level.Item>
					<Level.Right>
						{loveButton}
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


CatalogGrid.defaultProps = {
	linkToPdp: '/',
	love: null,
	optimistic: true // set to false if lovelist using loading, true otherwise
};

export default CatalogGrid;
