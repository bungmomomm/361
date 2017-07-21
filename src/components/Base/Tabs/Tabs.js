import React, { Component } from 'react';
import styles from './Tabs.scss';
import classNames from 'classnames/bind';
import Icon from '@/components/Icon';
const cx = classNames.bind(styles);

export default class Tabs extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			tabActive: this.props.tabActive ? this.props.tabActive : 0
		};
		console.log('fa');
	}

	componentWillReceiveProps(newProps) {
		if (newProps.tabActive && newProps.tabActive !== this.props.tabActive) {
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
			panel: true
		});

		const $Items = this.props.children.map(($panel) => {
			return typeof $panel === 'function' ? $panel() : $panel;
		}).filter(($panel) => {
			return $panel;
		});

		const $menu = [];
		$Items.map(($panel, index) => {
			return $menu.push({
				title: $panel.props.title,
				icon: $panel.props.icon,
				children: $panel.props.children,
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
										tabTitle.icon ? <Icon name={tabTitle.icon} /> : null
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
							return (
								<div 
									key={i}
									className={this.state.tabActive === i ? styles.TabContent : null} 
								>
									{
										tabContent.children
									}
								</div>
							);
						})
					}
				</div>
			</div>
		);
	}
};

class Panel extends Tabs {
	render() {
		return this.props;
	}
};


Tabs.Panel = Panel;