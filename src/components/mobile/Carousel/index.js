import React, { PureComponent } from 'react';
import Carousel from 'nuka-carousel';
import classNames from 'classnames';
import Button from '../Button';
import styles from './carousel.scss';
import { isMobile } from 'react-device-detect';


const indexNext = (slideCount) => {
	
	// Set initial storage.
	if (!sessionStorage.getItem('slideIndex')) {
		sessionStorage.setItem('slideIndex', 0);
	}
	const index = sessionStorage.getItem('slideIndex');
	
	// Reset the slide next if only it is less than available content length
	if (index < (slideCount - 1)) {
		sessionStorage.setItem('slideIndex', parseInt(index, 10) + 1);
	}
	
	return parseInt(sessionStorage.getItem('slideIndex'), 10);
};

const indexPrev = () => {
	
	// Set the initial storage to be 0. So we can not slide previous if index is zero.
	if (!sessionStorage.getItem('slideIndex')) {
		sessionStorage.setItem('slideIndex', 0);
	}
	const index = sessionStorage.getItem('slideIndex');
	
	// Reset the slide next if only it is more than zero
	if (index > 0) {
		sessionStorage.setItem('slideIndex', parseInt(index, 10) - 1);
	}
	
	return parseInt(sessionStorage.getItem('slideIndex'), 10);
	
};

const Decorators = [
	{
		component: React.createClass({
			render() {
				const self = this;
				const createClassName = classNames(styles.arrowWrapper);
				return (!isMobile) ? (<Button style={{ marginLeft: '10px' }} className={createClassName} onClick={() => self.props.goToSlide(indexPrev())}><span className={styles.arrowItem}>{'<'}</span></Button>) : null;
			}
		}),
		position: 'CenterLeft'
	},
	{
		component: React.createClass({
			render() {
				const self = this;
				const slideCount = self.props.slideCount;
				const createClassName = classNames(styles.arrowWrapper);
				return (!isMobile) ? (<Button style={{ marginRight: '10px' }} className={createClassName} onClick={() => self.props.goToSlide(indexNext(slideCount))}><span className={styles.arrowItem}>{'>'}</span></Button>) : null;
			}
		}),
		position: 'CenterRight'
	},
	{
		component: React.createClass({
			render() {
				const self = this;
				const indexes = this.getIndexes(self.props.slideCount, self.props.slidesToScroll);
				return (
					<ul className={styles.pagination}>
						{
							indexes.map((index) => {
								const createClassName = classNames(
									self.props.currentSlide === index && styles.active,
									styles.button
								);
        
								return (
									<li className={styles.list} key={index}>
										<Button
											className={createClassName}
											onClick={() => self.props.goToSlide(null, index)}
										/>
									</li>
								);
							})
						}
					</ul>
				);
			},
			getIndexes(count, inc) {
				const arr = [];
				for (let i = 0; i < count; i += inc) {
					arr.push(i);
				}
				return arr;
			}
		}),
		position: 'BottomCenter'
	}
];

class NukeCarousel extends PureComponent {

	componentDidMount() {
		this.updateDimentionCarousel();
	}

	componentDidUpdate() {
		this.updateDimentionCarousel();

	}

	updateDimentionCarousel() {
		setTimeout(() => {
			if (this.node !== null) {
				this.node.setDimensions();
			}
		}, 3000);
	}

	render() {
		const {
			className,
			children,
			...props,
		} = this.props;

		const createClassName = classNames(
			styles.container,
			className
		);
		
		let draggingValue = false;
		
		if (isMobile) {
			draggingValue = true;
		}
        
		return (
			<div>
				<Carousel width='100%' decorators={Decorators} dragging={draggingValue} ref={(n) => { this.node = n; }} className={createClassName} {...props}>
					{children}
				</Carousel>
			</div>
		);


	}
}

export default NukeCarousel;
