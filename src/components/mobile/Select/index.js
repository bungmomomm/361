import React from 'react';
import Button from '../Button';
import Input from '../Input';
import Picker from 'rmc-picker'; // Docs https://github.com/react-component/m-picker/tree/3.x
import styles from './select.scss';
import classNames from 'classnames';

const Select = (props) => {
	if (!props.show) return null;
	const { search, onSearch } = props;

	return (
		<div className={`${props.className || ''} ${styles.content}`}>
			<div className={styles.wrapper}>
				<div className={styles.action}>
					<div>{props.label}</div>
					<div><Button onClick={() => props.onClose()}>SELESAI</Button></div>
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
							backgroundColor: '#efefef'
						}}
						onChange={onSearch}
					/>
				)}

				<Picker
					onValueChange={(value) => props.onChange(value)}
					defaultSelectedValue={props.defaultValue}
				>
					{
						props.options.map((option, key) => {
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
};

export default Select;
