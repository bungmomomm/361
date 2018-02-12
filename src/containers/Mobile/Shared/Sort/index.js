import React, { Component } from 'react';
import { List, Svg, Button } from '@/components/mobile';
import PropTypes from 'prop-types';
import styles from './sort.scss';
import _ from 'lodash';

class Sort extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
		const { onSelected, sorts } = this.props;
		return (
			<div className={styles.filterNavigation}>
				{_.map(sorts, (sort, id) => {
					const icon = sort.is_selected ? <Svg src='ico_check.svg' /> : <Svg src='ico_empty.svg' />;
					return (
						<List key={id}>
							<Button onClick={(e) => onSelected(e, sort)}>
								<List.Content>
									{sort.title}
									{icon}
								</List.Content>
							</Button>
						</List>
					);
				})}
			</div>
		);
	}
}

Sort.propTypes = {
	onSelected: PropTypes.func,
	sorts: PropTypes.array
};

export default Sort;