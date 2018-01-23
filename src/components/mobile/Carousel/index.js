import React, { PureComponent } from 'react';
import Carousel from 'nuka-carousel';
import classNames from 'classnames';
import Button from '../Button';
import styles from './carousel.scss';

const Decorators = [
	{
		component: React.createClass({
			render() {
				return null;
			}
		})
	}, {
		component: React.createClass({
			render() {
				return null;
			}
		})
	}, {
		component: React.createClass({
			render() {
				const self = this;
				const indexes = this.getIndexes(self.props.slideCount, self.props.slidesToScroll);
				return (
					<ul className={styles.pagination}>
						{
							indexes.map((index) => {
								return (
									<li className={styles.list} key={index}>
										<Button
											className={`${self.props.currentSlide === index && styles.active} ${styles.button}`}
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
	
	updateDimentionCarousel() {
		setTimeout(() => {
			this.node.setDimensions();
		}, 0);
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

		return (
			<div>
				<Carousel decorators={Decorators} dragging ref={(n) => { this.node = n; }} className={createClassName} {...props}>
					{children}
				</Carousel>
			</div>
		);
	}
}

export default NukeCarousel;
