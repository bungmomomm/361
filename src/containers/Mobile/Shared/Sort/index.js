import React, { Component } from 'react';
import { List, Svg, Button } from '@/components/mobile';
import styles from './sort.scss';
import _ from 'lodash';

class Sort extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			sorts: props.sorts || []
		};
	}

	onClick(e, value) {
		const { onSort } = this.props;
		let { sorts } = this.state;
		sorts = _.map(sorts, (sort) => {
			sort.is_selected = 0;
			if (sort.q === value.q) {
				sort.is_selected = 1;
			}
			return sort;
		});
		this.setState({
			sorts
		});

		onSort(e, value);
	}

	render() {
		const { shown } = this.props;
		const { sorts } = this.state;
		if (shown) {
			return (
				<div className={styles.filterNavigation}>
					{_.map(sorts, (value, id) => {
						const icon = value.is_selected ? <Svg src='ico_check.svg' /> : <Svg src='ico_empty.svg' />;
						return (
							<List key={id}>
								<Button onClick={(e) => this.onClick(e, value)}>
									<List.Content>
										{value.title}
										{icon}
									</List.Content>
								</Button>
							</List>
						);
					})}
				</div>
			);
		}
		return null;
	}
}
export default Sort;