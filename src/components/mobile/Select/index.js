import React, { Component } from 'react';
import Button from '../Button';
import Input from '../Input';
import Picker from '../MPicker'; // Docs https://github.com/react-component/m-picker/tree/3.x
import styles from './select.scss';
import classNames from 'classnames';
import { debounce } from '@/utils';

class Select extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.show !== this.props.show) {
			if (nextProps.show) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.removeAttribute('style');
			}
		}
	}

	render() {
		if (!this.props.show) return null;
		const { search, onSearch } = this.props;

		return (
			<div className={`${this.props.className || ''} ${styles.content}`}>
				<div className={styles.wrapper}>
					<div className={styles.action}>
						<div>{this.props.label}</div>
						<div><Button onClick={() => this.props.onClose()}>SELESAI</Button></div>
					</div>

					{(search && onSearch) && (
						<Input
							id='search'
							name='search'
							flat
							placeholder='Quick search'
							style={{
								textAlign: 'left',
								padding: '20px 20px',
								backgroundColor: '#efefef',
								color: '#191919'
							}}
							onChange={debounce(onSearch, 500)}
						/>
					)}

					<Picker
						onValueChange={(value) => this.props.onChange(value)}
						defaultSelectedValue={this.props.defaultValue}
					>
						{
							this.props.options.map((option, key) => {
								const pickerItemClass = classNames(
									option.disabled ? 'text-line-through font-color--primary-ext-1' : null,
									option.note ? 'font-color--red' : null
								);
								return (
									<Picker.Item key={key} value={option.value} className={pickerItemClass}>
										{option.label}
										{option.note ? ` - ${option.note}` : null}
									</Picker.Item>
								);
							})
						}
					</Picker>
				</div>
			</div>
		);
	}
}

export default Select;
