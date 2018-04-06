import React, { PureComponent } from 'react';
import { Header, Page, Svg, List, Button } from '@/components/mobile';
import Action from './action';
// import styles from './tree.scss';

import _ from 'lodash';
import utils from './utils';
import handler from '@/containers/Mobile/Shared/handler';

@handler
class Location extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			activeTree: null,
			selected: null,
			data: props.data || [],
			resetDisabled: utils.getSelected(props.data).length < 1
		};
	}

	onApply(e) {
		const { data } = this.state;
		const { onApply } = this.props;
		const result = utils.getSelected(data);
		onApply(e, result);
	}

	onClick(e, value) {
		let { data } = this.state;
		data = utils.updateChilds(data, value, {
			is_selected: value.is_selected === 1 ? 0 : 1
		});
		const selected = utils.getSelected(data);
		this.setState({
			resetDisabled: selected.length < 1,
			data
		});
	}

	reset(e) {
		const { data } = this.state;
		this.setState({
			resetDisabled: true,
			data: utils.resetChilds(data)
		});
		this.props.onReset(e);
	}

	render() {
		const { onClose, title } = this.props;
		const { data, resetDisabled } = this.state;
		const HeaderPage = {
			left: (
				<Button onClick={onClose}>
					<Svg src='ico_arrow-back-left.svg' />
				</Button>
			),
			center: _.capitalize(title) || 'Default',
			right: null
		};

		const Icon = (active) => {
			if (active) {
				return <Svg src='ico_check.svg' />;
			}
			return <Svg src='ico_empty.svg' />;
		};

		return (
			<div style={this.props.style}>
				<Page color='white' style={{ marginTop: '15px' }}>
					<div>
						{_.map(data, (value, id) => {
							return (
								<List key={id}>
									<Button onClick={(e) => this.onClick(e, value)}>
										<List.Content className='padding--medium-v'>
											<div className='flex-row flex-middle'>
												<span>{value.facetdisplay}</span> <span className='font-color--primary-ext-2 margin--small-l'>({value.count})</span>
											</div>
											{Icon(value.is_selected)}
										</List.Content>
									</Button>
								</List>
							);
						})}
					</div>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action resetDisabled={resetDisabled} hasReset onReset={(e) => this.reset(e)} hasApply onApply={(e) => this.onApply(e)} />
			</div>
		);
	}
}

export default Location;
