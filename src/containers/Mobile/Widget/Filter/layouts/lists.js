import React, { PureComponent } from 'react';
import { Header, Page, Svg, List, Button } from '@/components/mobile';
import Action from './action';
import _ from 'lodash';
import utils from './utils';
import handler from '@/containers/Mobile/Shared/handler';

@handler
class Lists extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			data: props.data || [],
			resetDisabled: utils.getSelected(props.data).length < 1
		};
	}

	onClick(e, value) {
		let { data } = this.state;

		data = utils.updateChilds(data, value, {
			is_selected: value.is_selected === 1 ? 0 : 1
		});

		const resetDisabled = utils.getSelected(data).length < 1;
		this.setState({
			resetDisabled,
			data
		});
	}

	onApply(e) {
		const { data } = this.state;
		const { onApply } = this.props;
		const result = utils.getSelected(data);
		onApply(e, result);
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
		const { onReset, title } = this.props;
		const { data, resetDisabled } = this.state;
		const HeaderPage = {
			left: (
				<Button onClick={(e) => onReset(e, true)}>
					<Svg src='ico_arrow-back-left.svg' />
				</Button>
			),
			center: _.capitalize(title) || 'Default',
			right: null
		};

		const lists = _.map(data, (value, id) => {
			const icon = value.is_selected ? <Svg src='ico_check.svg' /> : <Svg src='ico_empty.svg' />;
			let label = value.facetdisplay;
			if (parseInt(value.facetrange, 10) === 19) {
				label = (
					<Svg src='mm_ico_gojek.svg' />
				);
			}
			return (
				<Button key={id} align='left' wide onClick={(e) => this.onClick(e, value)}>
					<List.Content className='padding--medium-v'>
						<div className='flex-row flex-middle'>
							<span>{label}</span> <span className='font-color--primary-ext-2 margin--small-l'>({value.count})</span>
						</div>
						{icon}
					</List.Content>
				</Button>
			);
		});

		return (
			<div style={this.props.style}>
				<Page color='white' style={{ marginTop: '15px' }}>
					<List>
						{lists}
					</List>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action resetDisabled={resetDisabled} hasReset onReset={(e) => this.reset(e)} hasApply onApply={(e) => this.onApply(e)} />
			</div>
		);
	}
}

export default Lists;
