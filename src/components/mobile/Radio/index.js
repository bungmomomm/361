import React, { PureComponent } from 'react';
import styles from './radio.scss';

class Radio extends PureComponent {
	render() {
		return (
			<div className={`${this.props.className || ''} ${styles.container}`} style={this.props.style}>
				{
					this.props.data.map((list, idx) => (
						<label htmlFor={`${this.props.name}-${idx}`} key={idx}>
							<input disabled={list.disabled || false} onChange={() => this.props.onChange(list.value, list)} checked={this.props.checked === list.value} id={`${this.props.name}-${idx}`} type='radio' name={this.props.name} defaultValue={list.value} />
							<div className={styles.label}>{list.label}</div>
						</label>
					))
				}
			</div>
		);
	}
}


export default Radio;
