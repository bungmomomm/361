import React, { PureComponent } from 'react';
import { Header, Page, Svg, List, Button } from '@/components/mobile';
import Action from './action';
import _ from 'lodash';
import renderIf from '@/utils/renderIf';
import Divider from '@/components/mobile/Divider';

const updateChilds = (childs, value) => {
	childs = _.map(childs, (facetData) => {
		if (facetData.facetrange === value.facetrange) {
			facetData.is_selected = facetData.is_selected === 1 ? 0 : 1;
		}
		if (facetData.childs && facetData.childs.length > 0) {
			facetData.childs = updateChilds(facetData.childs, value);
		}
		return facetData;
	});

	return childs;
};

const getSelected = (childs, source = false) => {
	if (!source) {
		source = [];
	}
	_.forEach(childs, (facetData) => {
		if (facetData.is_selected === 1) {
			source.push(facetData);
		}

		if (facetData.childs && facetData.childs.length > 0) {
			source = getSelected(facetData.childs, source);
		}
	});

	return source;
};

class Size extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			data: props.data || []
		};
	}

	onClick(e, value) {
		const { data } = this.state;
		
		this.setState({
			data: updateChilds(data, value)
		});
	}

	onApply(e) {
		const { data } = this.state;
		const { onApply } = this.props;
		const result = getSelected(data);
		onApply(e, result);
	}
	
	render() {
		const { onClose } = this.props;
		const { data } = this.state;
		const HeaderPage = {
			left: (
				<Button onClick={onClose}>
					<Svg src='ico_arrow-back-left.svg' />
				</Button>
			),
			center: 'Ukuran',
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
						<Button key={key} align='left' wide onClick={(e) => this.onClick(e, childSize)}><List.Content>{childSize.facetdisplay} {icon}</List.Content></Button>
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
					<Button key={id} align='left' wide onClick={(e) => this.onClick(e, size)}><List.Content>{size.facetdisplay} {icon}</List.Content></Button>
				</div>
			);
		});

		return (
			<div style={this.props.style}>
				<Page hideFooter>
					<List>
						{sizeList}
					</List>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action hasApply onApply={(e) => this.onApply(e)} />
			</div>
		);
	}
}

export default Size;
