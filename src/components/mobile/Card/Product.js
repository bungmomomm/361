import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Image from '../Image';
import Svg from '../Svg';
import Carousel from '../Carousel';
import Button from '../Button';
import Level from '../Level';
import styles from './card.scss';
import { Link } from 'react-router-dom';
import _ from 'lodash';

class Product extends PureComponent {
	constructor(props) {
		super(props);
		this.setCarouselSlideIndex = this.setCarouselSlideIndex.bind(this);
		this.slideWrapAround = true;
		this.state = {
			slideIndex: 0
		};
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

	renderCarousel(pdpLinkDisabled = true) {
		const { data, onImageItemClick } = this.props;
		const slideIndex = this.getSlideIndex();
		const carouselContent = (
			<Carousel
				slideIndex={slideIndex}
				afterSlide={this.setCarouselSlideIndex}
				wrapAround={this.slideWrapAround}
			>
				{
					data.images.map((image, idx) => (
						<div tabIndex='0' role='button' onClick={onImageItemClick} key={idx} data-img={image.mobile}>
							<Image lazyload src={image.mobile} alt={data.product_title} />
						</div>
					))
				}
			</Carousel>
		);

		if (pdpLinkDisabled) return carouselContent;

		return (<Link to={this.props.linkToPdp}>{carouselContent}</Link>);
	}

	render() {
		const { className, type, data, isLoved, disabledLovelist, totalComments, totalLovelist } = this.props;
		const createClassName = classNames(styles.container, styles[type], className);
		const loveIcon = (isLoved) ? 'ico_love-filled.svg' : 'ico_lovelist.svg';

		return (
			<div className={createClassName}>

				{this.renderCarousel()}

				<Level className={`${styles.action} border-top border-bottom`}>
					<Level.Item className='flex-middle flex-center'>
						<Button onClick={this.props.onBtnLovelistClick} data-id={data.id} disabled={disabledLovelist}>
							<Svg src={loveIcon} />
							<span>{totalLovelist} Suka</span>
						</Button>
					</Level.Item>
					<Level.Item className='flex-middle flex-center'>
						<Button onClick={() => this.props.onBtnCommentClick('comments')}>
							<Svg src='ico_comment.svg' />
							<span>{totalComments || 0} Komentar</span>
						</Button>
					</Level.Item>
				</Level>
				<div className={styles.title}>
					<span className='font-small text-uppercase font--lato-bold font-color--primary'>{data.brand.name}</span>
					<span className='text-elipsis-two-line font-color--primary-ext-2'>{data.product_title}</span>
				</div>
			</div>
		);
	}
}

export default Product;
