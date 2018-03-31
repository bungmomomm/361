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
	constructor(props) {
		super(props);
		this.state = {
			optimistic: true,
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
		let loved = true;
		if (lovelistStatus && lovelistStatus === 1) {
			loved = false;
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
			love,
			optimistic,
			productOnClick,
			...props
		} = this.props;
		const { loved } = this.state;

		const disableLovelist = lovelistDisable && lovelistAddTo;
		const createClassName = classNames(styles.container, styles[type], className);
		let lovelistIcon = lovelistStatus && lovelistStatus === 1 ? 'ico_love-filled.svg' : 'ico_love.svg';
		if (optimistic) {
			lovelistIcon = loved && loved === 1 ? 'ico_love-filled.svg' : 'ico_love.svg';
		}
		const discountBadge = pricing.formatted.discount !== '' ? (
			<div style={{ marginLeft: '1.5rem' }}>
				<Badge rounded color='red'>
					<span className='font--lato-bold'>{pricing.formatted.discount}</span>
				</Badge>
			</div>
		) : '';

		const basePrice = pricing.formatted.discount !== '' ? (
			<div className={styles.discount}>{pricing.formatted.base_price}</div>
		) : '';

		let loveButton = (
			<Button onClick={(e) => this.lovelistAddTo()} disabled={disableLovelist}>
				<Svg src={lovelistIcon} />
				<span>{lovelistTotal} Suka</span>
			</Button>
		);
		if (love) {
			loveButton = love;
		}
		return (
			<div className={createClassName} {...props} data-loved={lovelistStatus}>
				<Link to={linkToPdp}>
					{images.length > 1 ? (
						<Carousel>
							{
								images.slice(0, 9).map((image, index) => (
									<div className='placeholder-image' key={index} tabIndex='0' role='button' onClick={() => productOnClick()}>
										<Image src={image.thumbnail} lazyload alt={productTitle} />
									</div>
								))
							}
						</Carousel>
					) : (
						images.slice(0, 9).map((image, index) => (
							<div className='placeholder-image' key={index} tabIndex='0' role='button' onClick={productOnClick ? () => productOnClick() : () => true}>
								<Image src={image.thumbnail} lazyload alt={productTitle} />
							</div>
						))
					)}
				</Link>
				<Level
					className={styles.action}
					style={{ borderBottom: '1px solid #D8D8D8' }}
				>
					<Level.Item>
						{loveButton}
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
					<div className={styles.title} tabIndex='0' role='button' onClick={productOnClick ? () => productOnClick() : () => true}>
						<span className='font-small text-uppercase font--lato-bold font-color--primary'>{brandName}</span>
						<span className='text-elipsis-two-line font-color--primary-ext-2'>{productTitle}</span>
					</div>
					<Level className='padding--none-t'>
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
	commentTotal: 0,
	lovelistTotal: 0,
	optimistic: true // set to false if lovelist using loading, true otherwise
};

Catalog.propTypes = {
	brandName: PropTypes.string,
	linkToPdp: PropTypes.string.isRequired
};

export default Catalog;
