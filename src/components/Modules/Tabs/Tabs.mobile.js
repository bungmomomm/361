import React, { Component } from 'react';
import styles from './Tabs.mobile.scss';
// import PropTypes from 'prop-types';

export default class TabsMobile extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			tabActive: this.props.tabActive || 0
		};
	}

	changeTab(index) {
		if (this.props.onBeforeChange) this.props.onBeforeChange(this.state.tabActive);
		this.setState({ tabActive: index });
		if (this.props.onAfterChange) this.props.onAfterChange(index);
	}

	render() {
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
				children: $panelProps.children
			});
		});
		
		return (
			<div className={styles.tabsWrapper}>
				<div className={styles.tabHeader}>
					{
						$menu.map((tabTitle, index) => (
							<button  
								key={index}
								type='button'
								onClick={() => this.changeTab(index)} 
								className={this.state.tabActive === index ? styles.TabActive : null}
								disabled={this.state.tabActive === index}
							>
								{tabTitle.title}
							</button>
						))
					}
				</div>
				<div className={styles.TabContent}>
					{
						$menu.map((tabContent, index) => (
							this.state.tabActive === index && (
								<div key={index} className={styles.TabOverflow}>
									{tabContent.children}
								</div>		
							)
						))
					}
				</div>
			</div> 
		);
	}
}