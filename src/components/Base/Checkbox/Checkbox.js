import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectProps } from '@/decorators';
import styles from './Checkbox.scss';
import newId from '@/utils/newId.js';

export default class Checkbox extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.onChange = this.onChange.bind(this);
		this.state = {
			checked: this.props.checked || false
		};
	}

	onChange(event) {
		const ContentState = !this.state.checked;
		this.setState({
			checked: ContentState
		});
		return this.props.onChange ? this.props.onChange(ContentState) : null;
	}

	@injectProps
	render({
		value,
		name,
		text
	}) {
		const idFor = newId();
		const { checked } = this.state;
		return (
			<label className={styles.checkboxWrapper} htmlFor={idFor}>
				<input 
					id={idFor} 
					type='checkbox' 
					checked={checked} 
					onChange={this.onChange} 
					defaultValue={value} 
					className={styles.Checkbox} 
					name={name} 
				/>
				<span className={styles.checkboxInput} />
				<span className={styles.checkboxText}>
					{text}
				</span>
			</label>
		);
	}
};

Checkbox.propTypes = {
	checked: PropTypes.bool,
	onChange: PropTypes.func,
	value: PropTypes.string,
	name: PropTypes.string,
	text: PropTypes.string,
};