import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './slider.scss';

class Slider extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			percentInput: 0
		};
	}

	onChangeInput(value) {
		const percentInput = ((value.target.value - this.props.min) * 100) / (this.props.max - this.props.min);
		this.setState({ percentInput });
		if (typeof this.onc === 'function') {
			this.onc(value.target.value);
		}
	};

	render() {
		const {
			className,
			onChange,
			...props
		} = this.props;

		this.onc = onChange;

		const createClassName = classNames(
			styles.container,
			className
		);
		
		return (
			<div className={createClassName}>
				<input name='green' type='range' onChange={(e) => this.onChangeInput(e)} {...props} />
				<div className='rangeslider rangeslider-horizontal' id='js-rangeslider-0'>
					<div className='rangeslider-thumb' />
					<div style={{ width: `${this.state.percentInput}%` }} className='rangeslider-fill-lower' />
					<div style={{ left: `${this.state.percentInput}%` }} className='rangeslider-thumb' />
				</div>
			</div>
		);
		
	}
}

export default Slider;
