import React, { PureComponent } from 'react';
import classNames from 'classnames';
import InputRange from 'react-input-range';
import styles from './slider.scss';

class Slider extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			value: {
				min: 3,
				max: 7,
			},
		};
	}

	render() {
		const {
			className
		} = this.props;

		const createClassName = classNames(
			styles.container,
			className
		);

		return (
			<div className={createClassName}>
				<InputRange
					draggableTrack
					maxValue={this.props.max}
					minValue={this.props.min}
					onChange={(value) => this.setState({ value })}
					onChangeComplete={value => this.props.onChange(value)}
					value={this.state.value}
				/>
			</div>
		);

	}
}

export default Slider;
