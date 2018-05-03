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
	
	// Re set the slide next if only it is less than available content length
	if (index < (slideCount - 1)) {
		sessionStorage.setItem('slideIndex', parseInt(index, 10) + 1);
	} 
	
	// Console.log
	return parseInt(sessionStorage.getItem('slideIndex'), 10);
};

const indexPrev = () => {
	
	// Clear session storage first.
	
	if (!sessionStorage.getItem('slideIndex')) {
		sessionStorage.setItem('slideIndex', 0);
	}
	const index = sessionStorage.getItem('slideIndex');
	
	// Re set the slide next if only it is less than available content length
	if (index > 0) {
		sessionStorage.setItem('slideIndex', parseInt(index, 10) - 1);
	}
	
	// Console.log
	return parseInt(sessionStorage.getItem('slideIndex'), 10);
	
};

const Decorators = [
	{
		component: React.createClass({
			render() {
				const self = this;
				const createClassName = classNames(styles.arrow);
				return (!isMobile) ? (<Button className={createClassName} onClick={() => self.props.goToSlide(indexPrev())} />) : null;
			}
		}),
		position: 'CenterLeft'
	},
	{
		component: React.createClass({
			render() {
				const self = this;
				const slideCount = self.props.slideCount;
				const createClassName = classNames(styles.arrow);
				return (!isMobile) ? (<Button className={createClassName} onClick={() => self.props.goToSlide(indexNext(slideCount))} />) : null;
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
