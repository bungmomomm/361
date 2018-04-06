import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Image from '../Image';
import Svg from '../Svg';
import Carousel from '../Carousel';
import Button from '../Button';
import Level from '../Level';
import Badge from '../Badge';
import Comment from '../Comment';
import styles from './card.scss';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import { trimString } from '@/utils';

class Lovelist extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			slideIndex: 0
		};

		this.slideWrapAround = true;
		this.setCarouselSlideIndex = this.setCarouselSlideIndex.bind(this);
	}

	setCarouselSlideIndex(newSlideIndex) {
		this.setState({ slideIndex: newSlideIndex });
		// set slideIndex value on parent component
		if (_.isFunction(this.props.setCarouselSlideIndex)) {
			this.props.setCarouselSlideIndex(newSlideIndex);
		}
	}

	getSlideIndex() {
		// return slideIndex on parent component instead of its slideIndex itself
		if (!_.isUndefined(this.props.slideIndex) && _.isInteger(this.props.slideIndex)) {
			return this.props.slideIndex;
		}
		return this.state.slideIndex;
	}

	render() {
		const { className, type, data, isLoved, linkToPdp, linkToComments, lovelistDisabled } = this.props;
		const createClassName = classNames(styles.container, styles[type], className);
		const loveListEmpty = classNames(styles.lovelistEmpty);
		const loveIcon = (isLoved) ? 'ico_love-filled.svg' : 'ico_lovelist.svg';

		const discountBadge = (data.pricing.discount !== '0%' || _.toInteger(data.pricing.discount) !== 0) ? (
			<div style={{ marginLeft: '1.5rem' }}>
				<Badge rounded color='red'>
					<span className='font--lato-bold'>{data.pricing.discount}</span>
				</Badge>
			</div>
		) : '';

		const basePrice = data.pricing.discount !== '0%' ? (
			<div className={styles.discount}>{data.pricing.formatted.base_price}</div>
		) : '';

		const loveButton = (
			<Button onClick={this.props.onBtnLovelistClick} data-id={data.id} disabled={lovelistDisabled} >
				<Svg src={loveIcon} />
				<span>{data.totalLovelist} Suka</span>
			</Button>
		);

		return (
			<div className={createClassName} >
				{data.stock === 0 && (
					<Link to={linkToPdp} className={loveListEmpty}>
						<Carousel wrapAround={this.slideWrapAround} >
							{
								data.images.map((image, index) => (
									<Image key={index} src={image.original} lazyload alt={data.product_title} />
								))
							}
						</Carousel>
					</Link>
				)}
				{data.stock > 0 && (
					<Link to={linkToPdp}>
						<Carousel wrapAround={this.slideWrapAround} >
							{
								data.images.map((image, index) => (
									<Image key={index} src={image.original} lazyload alt={data.product_title} />
								))
							}
						</Carousel>
					</Link>
				)}
				<Level
					className={styles.action}
					style={{ borderBottom: '1px solid #D8D8D8' }}
				>
					<Level.Item>
						{loveButton}
					</Level.Item>
					<Level.Item>
						<Link to={(linkToComments) || '/'}>
							<Button wide>
								<Svg src='ico_comment.svg' />
								<span>{data.totalComments} Komentar</span>
							</Button>
						</Link>
					</Level.Item>
				</Level>
				<Link to={(linkToPdp) || '/'}>
					<div className={styles.title}>
						<span className='font-small text-uppercase font--lato-bold font-color--primary'>{data.brand.name}</span>
						<span className='text-elipsis-two-line font-color--primary-ext-2'>{trimString(data.product_title)}</span>
					</div>
					<Level className='padding--none-t'>
						<Level.Item>
							<div className={styles.blockPrice}>
								<div>
									<div className={styles.price}>{data.pricing.formatted.effective_price}</div>
									{basePrice}
								</div>
								{discountBadge}
							</div>
						</Level.Item>
						<Level.Right>&nbsp;</Level.Right>
					</Level>
				</Link>
				<div className='margin--medium-v --disable-flex padding--medium-h'>
					<Link to={linkToComments} className='font--lato-normal font-color--primary-ext-2'>
						{(data.totalComments > 0) ? `Lihat ${data.totalComments} Komentar` : 'Belum Ada Komentar'}
					</Link>
					{((typeof data.last_comments !== 'undefined') && data.last_comments.length > 0) && (
						<Comment type='lite-review' data={data.last_comments} />
					)}
				</div>
			</div>
		);
	}
}

export default Lovelist;
