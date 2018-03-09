import React, { PureComponent } from 'react';
import classNames from 'classnames';
import InputRange from 'react-input-range';
import styles from './slider.scss';

class Slider extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			value: {
				min: props.min + 1,
				max: props.max - 1
			},
		};
	}

	componentWillReceiveProps(nextProps) {
		// console.log(nextProps.value);
		if (typeof nextProps.value.min !== 'undefined' && (this.state.value.min !== nextProps.value.min || this.state.value.max !== nextProps.value.max)) {
			this.setState({
				value: nextProps.value
			});
		}
	}

	onChange(value) {
		const { onChange } = this.props;
		this.setState({ value });
		if (typeof onChange !== 'undefined') {
			onChange.apply(this, [value]);
		}
	}

	onChangeComplete(value) {
		const { onChangeComplete } = this.props;

		if (typeof onChangeComplete !== 'undefined') {
			onChangeComplete.apply(this, [value]);
		}
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
					onChange={(value) => this.onChange(value)}
					onChangeComplete={value => this.onChangeComplete(value)}
					value={this.state.value}
				/>
			</div>
		);

	}
}

export default Slider;
