import React, { Component } from 'react';
import { List, Svg, Button } from '@/components/mobile';
import styles from './sort.scss';
import _ from 'lodash';

import classNames from 'classnames';
import handler from '@/containers/Mobile/Shared/handler';

@handler
class Sort extends Component {

	static toggleBodyOverflow(shown) {
		if (shown) {
			document.getElementsByTagName('body')[0].style.overflow = 'hidden';
		} else {
			document.getElementsByTagName('body')[0].style.overflow = 'auto';
		}
	}

	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			sorts: props.sorts || []
		};
	}

	componentWillReceiveProps(nextProps) {
		const { sorts } = this.state;
		this.setState({
			sorts: nextProps.sorts || sorts
		});
		this.constructor.toggleBodyOverflow(nextProps.shown);
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
		const { isSticky, shown } = this.props;
		const { sorts } = this.state;
		if (shown) {
			const cx = classNames(
				isSticky ? styles.filterNavigationFixed : styles.filterNavigation
			);
			return (
				<div className={cx}>
					{this.props.onCloseOverlay && <button onClick={() => this.props.onCloseOverlay()} className={styles.overlay} />}
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
