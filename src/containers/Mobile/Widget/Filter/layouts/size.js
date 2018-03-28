import React, { PureComponent } from 'react';
import { Header, Page, Svg, List, Button } from '@/components/mobile';
import Action from './action';
import _ from 'lodash';
import renderIf from '@/utils/renderIf';
import Divider from '@/components/mobile/Divider';
import utils from './utils';
import handler from '@/containers/Mobile/Shared/handler';

@handler
class Size extends PureComponent {
	constructor(props) {
		super(props);
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
		const selected = utils.getSelected(data);
		this.setState({
			resetDisabled: selected.length < 1,
			data
		});
	}

	onApply(e) {
		const { data } = this.state;
		const { onApply } = this.props;
		const result = utils.getSelected(data);
		onApply(e, result);
	}

	reset() {
		const { data } = this.state;
		this.setState({
			resetDisabled: true,
			data: utils.resetChilds(data)
		});
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

		// to do: use below logic when implement
		// const icon = <Svg src='ico_check.svg' />;

		const sizeList = _.map(data, (size, id) => {
			let childSizes = null;
			if (size.childs && size.childs.length > 0) {
				childSizes = _.map(size.childs, (childSize, key) => {
					const icon = childSize.is_selected ? <Svg src='ico_check.svg' /> : <Svg src='ico_empty.svg' />;
					return (
						<Button key={key} align='left' wide onClick={(e) => this.onClick(e, childSize)}>
							<List.Content className='padding--medium-v'>
								<div className='flex-row flex-middle'>
									<span>{childSize.facetdisplay}</span> <span className='font-color--primary-ext-2 margin--small-l'>({childSize.count})</span>
								</div>
								{icon}
							</List.Content>
						</Button>
					);
				});

				return (
					<div key={id}>
						{renderIf(size.facetdisplay !== '')(
							<Divider type='segment'>
								<Divider.Content>{size.facetdisplay} <span>({size.count} produk)</span></Divider.Content>
							</Divider>
						)}
						{childSizes}
					</div>
				);
			}
			const icon = size.is_selected ? <Svg src='ico_check.svg' /> : <Svg src='ico_empty.svg' />;
			return (
				<div>
					<Button key={id} align='left' wide onClick={(e) => this.onClick(e, size)}>
						<List.Content className='padding--medium-v'>
							<div className='flex-row flex-middle'>
								<span>{size.facetdisplay}</span> <span className='font-color--primary-ext-2 margin--small-l'>({size.count})</span>
							</div>
							{icon}
						</List.Content>
					</Button>
				</div>
			);
		});

		return (
			<div style={this.props.style}>
				<Page color='white' style={{ marginTop: '15px' }}>
					<List>
						{sizeList}
					</List>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action resetDisabled={resetDisabled} hasReset onReset={(e) => this.reset()} hasApply onApply={(e) => this.onApply(e)} />
			</div>
		);
	}
}

export default Size;
