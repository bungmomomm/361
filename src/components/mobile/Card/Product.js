import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Image from '../Image';
import Svg from '../Svg';
import Carousel from '../Carousel';
import Button from '../Button';
import Level from '../Level';
import styles from './card.scss';
import { Link } from 'react-router-dom';
import { hyperlink } from '@/utils';
import _ from 'lodash';

class Product extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			slideIndex: 0
		};

		this.setCarouselSlideIndex = this.setCarouselSlideIndex.bind(this);
		this.slideWrapAround = true;
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
		const { className, type, data, isLoved, linkToPdpDisabled } = this.props;
		const createClassName = classNames(styles.container, styles[type], className);
		const linkToPdpCreator = hyperlink('', ['product', data.id], null);
		const loveIcon = (isLoved) ? 'ico_love-filled.svg' : 'ico_lovelist.svg';
		const slideIndex = this.getSlideIndex();

		return (
			<div className={createClassName}>
				{(!linkToPdpDisabled) ? (
					<Link to={linkToPdpCreator}>
						<Carousel
							slideIndex={slideIndex}
							afterSlide={this.setCarouselSlideIndex}
							wrapAround={this.slideWrapAround}
						>
							{
								data.images.map((image, idx) => (
									<div tabIndex='0' role='button' onClick={this.props.onImageItemClick} key={idx} data-img={image.mobile}>
										<Image lazyload src={image.mobile} alt={data.product_title} />
									</div>
								))
							}
						</Carousel>
					</Link>
				) : 
					(
						<Carousel
							slideIndex={slideIndex}
							afterSlide={this.setCarouselSlideIndex}
							wrapAround={this.slideWrapAround}
						>
							{
								data.images.map((image, idx) => (
									<div tabIndex='0' role='button' onClick={this.props.onImageItemClick} key={idx} data-img={image.mobile}>
										<Image src={image.mobile} alt={data.product_title} />
									</div>
								))
							}
						</Carousel>
					)
				}
				<Level className={`${styles.action} border-top border-bottom`}>
					<Level.Item className='flex-middle flex-center'>
						<Button onClick={this.props.onBtnLovelistClick} data-id={data.id}>
							<Svg src={loveIcon} />
							<span>{data.totalLovelist} Suka</span>
						</Button>
					</Level.Item>
					<Level.Item className='flex-middle flex-center'>
						<Button onClick={() => this.props.onBtnCommentClick('comments')}>
							<Svg src='ico_comment.svg' />
							<span>{data.totalComments || 0} Komentar</span>
						</Button>
					</Level.Item>
				</Level>
				<div className={styles.title}>
					{data.brand.name}
					<span>{data.product_title}</span>
				</div>
			</div>
		);
	}
}

export default Product;
