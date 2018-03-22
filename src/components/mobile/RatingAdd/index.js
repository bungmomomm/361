import React, { PureComponent } from 'react';
import styles from './ratingadd.scss';
import _ from 'lodash';
import Svg from '../Svg';

class RatingAdd extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			current: null
		};
		this.onChangeHandler = this.onChangeHandler.bind(this);
	}

	onChangeHandler(event) {
		// console.log(event.target.value);
		this.setState({ current: event.target.value });
		// this.props.onChange();
	}

	render() {
		const numRadio = (this.props.total * 2);
		return (
			<div className='flex-row'>
				{
					_.times(numRadio, (index) => {
						const value = ((index + 1) / 2);
						const ab = (index) % 2 === 0 ? 'a' : 'b';
						const selected = (value <= this.state.current) ? '-selected' : '';
						return (
							<div key={index}>
								<input
									id={`${this.props.name}-${index}`}
									name={this.props.name}
									type='radio'
									className={styles.noDisplay}
									value={value}
									onChange={this.onChangeHandler}
								/>
								<label htmlFor={`${this.props.name}-${index}`}>
									<Svg src={`ico_star-half${selected}-${ab}.svg`} />
								</label>
							</div>
						);
					})
				}
			</div>
		);
	}
}


export default RatingAdd;
