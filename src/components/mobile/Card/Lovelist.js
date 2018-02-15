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
import { hyperlink } from '@/utils';
import _ from 'lodash';

class Lovelist extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			slideIndex: 0
		};

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
		const { className, type, data, isLoved } = this.props;
		const createClassName = classNames(styles.container, styles[type], className);
		const linkToPdpCreator = hyperlink('', ['product', data.product_id], null);
		const loveIcon = (isLoved) ? 'ico_love-filled.svg' : 'ico_lovelist.svg';
		const slideIndex = this.getSlideIndex();

		return (
			<div className={createClassName}>
				<Link to={linkToPdpCreator}>
					<Carousel
						slideIndex={slideIndex}
						afterSlide={this.setCarouselSlideIndex}
					>
						{
							data.images.map((image, idx) => (
								<div tabIndex='0' role='button' onClick={this.props.onImageItemClick} key={idx} data-img={image.mobile}>
									<Image src={image.mobile} alt={data.product_title} />
								</div>
							))
						}
					</Carousel>
				</Link>
				<Level
					className={styles.action}
					style={{ borderBottom: '1px solid #D8D8D8' }}
				>
					<Level.Item>
						<Button onClick={this.props.onBtnLovelistClick}>
							<Svg src={loveIcon} />
							<span>{data.lovelistTotal}</span>
						</Button>
					</Level.Item>
					<Level.Item>
						<Button onClick={this.props.onBtnCommentClick}>
							<Svg src='ico_comment.svg' />
							<span>38</span>
						</Button>
					</Level.Item>
				</Level>
				<div className={styles.title}>
					{data.product_title}
					<span>{data.brand}</span>
				</div>
				<Level className={styles.footer}>
					<Level.Item>
						<div className={styles.blockPrice}>
							<div>
								<div className={styles.price}>{data.pricing.formatted.effective_price}</div>
								<div className={styles.discount}>{data.pricing.formatted.base_price}</div>
							</div>
							<div style={{ marginLeft: '1.5rem' }}>
								<Badge rounded color='red'>
									<span className='font--lato-bold'>{data.pricing.discount}</span>
								</Badge>
							</div>
						</div>
					</Level.Item>
					<Level.Right>
						<Button color='secondary' size='medium' rounded>
							Beli aja
						</Button>
					</Level.Right>
				</Level>
			</div>
		);
	}
}

export default Lovelist;
