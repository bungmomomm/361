import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Tabs.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
import Panel from './TabPanel';

import Icon from '@/components/Icon';
import Sprites from '@/components/Sprites';
import { renderIf } from '@/utils';

export default class Tabs extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			tabActive: this.props.tabActive || 0
		};
	}

	componentWillReceiveProps(newProps) {
		if (newProps.tabActive !== this.props.tabActive) {
			this.setState({
				tabActive: newProps.tabActive
			});
		}
	};

	changeTab(activeTab) {
		if (this.props.onBeforeChange) {
			// return onBeforeChange function to parent
			this.props.onBeforeChange(this.state.tabActive);
		}
		this.setState({
			tabActive: activeTab
		});
		if (this.props.onAfterChange) {
			// return onAfterChange function to parent
			this.props.onAfterChange(this.state.tabActive);
		}
	};

	render() {
		const classTabPanel = cx({
			panel: true,
			stretch: !!this.props.stretch
		});

		const $Items = this.props.children.map(($panel) => {
			return typeof $panel === 'function' ? $panel() : $panel;
		}).filter(($panel) => {
			return $panel;
		});

		const $menu = [];
		$Items.map(($panel) => {
			const $panelProps = $panel.props;
			return $menu.push({
				title: $panelProps.title,
				icon: $panelProps.icon,
				iconActive: $panelProps.iconActive,
				children: $panelProps.children,
				sprites: $panelProps.sprites,
				spritesActive: $panelProps.spritesActive
			});
		});

		return (
			<div className={classTabPanel}>
				<div className={styles.tabHeader}>
					{
						$menu.map((tabTitle, i) => {
							return (
								<button  
									key={i}
									onClick={() => this.changeTab(i)} 
									className={this.state.tabActive === i ? styles.TabActive : null} 
									type='button'
								>
									{
										renderIf(tabTitle.icon)(
											<Icon 
												name={
													(this.state.tabActive === i && tabTitle.iconActive) ? 
													tabTitle.iconActive : tabTitle.icon
												}
											/>
										)
									}
									{
										renderIf(tabTitle.sprites)(
											<Sprites 
												name={
													(this.state.tabActive === i && tabTitle.spritesActive) ? 
													tabTitle.spritesActive : tabTitle.sprites
												}
											/>
										)
									}
									{tabTitle.title}
								</button>
							);
						})
					}
				</div>
				<div className={styles.tabContent}>
					{
						$menu.map((tabContent, i) => {
							return this.state.tabActive !== i ? null : (
								<div key={i} className={styles.TabOverflow}>
									{tabContent.children}
								</div>
							);
						})
					}
				</div>
			</div>
		);
	}
};
Tabs.propTypes = {
	tabActive: PropTypes.number,
	onBeforeChange: PropTypes.func,
	onAfterChange: PropTypes.func,
	stretch: PropTypes.bool,
	children: PropTypes.node
};

Tabs.Panel = Panel;