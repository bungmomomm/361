import React from 'react';
import style from './select.scss';

const Select = (props) => {
	const { items, ...rest } = props;
	return (
		<div className={`${style['styled-select']} slate`}>
			<select {...rest}>
				{!items ? '' : items.map((item, i) => {
					let attrs = item;
					if (typeof item !== 'object') {
						attrs = {
							value: item,
							label: item
						};
					}

					attrs.key = i;

					const { label, ...attr } = attrs;
					return <option {...attr}>{label || ''}</option>;
				})}
			</select>
		</div>
	);
};

Select.defaultProps = {
	selected: ''
};

export default Select;
