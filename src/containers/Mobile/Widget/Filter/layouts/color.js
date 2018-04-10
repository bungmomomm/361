import React, { PureComponent } from 'react';
import { Header, Page, Svg, List, Button, Badge } from '@/components/mobile';
import Action from './action';
import _ from 'lodash';
import { isHexColor, renderIf } from '@/utils';
import utils from './utils';
import handler from '@/containers/Mobile/Shared/handler';

@handler
class Color extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			data: props.data || [],
			resetDisabled: utils.getSelected(props.data).length < 1
		};
		this.props = props;
	}

	componentWillReceiveProps(np) {
		if (np.data) {
			this.setState({
				data: np.data
			});
		}
	}

	onClick(e, value) {
		let { data } = this.state;
		data = utils.updateChilds(data, value, {
			is_selected: value.is_selected === 1 ? 0 : 1
		});

		const selected = utils.getSelected(data);
		const resetDisabled = selected.length < 1;
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
		const { resetDisabled, data } = this.state;
		const HeaderPage = {
			left: (
				<Button onClick={(e) => onReset(e, true)}>
					<Svg src='ico_arrow-back-left.svg' />
				</Button>
			),
			center: _.capitalize(title) || 'Default',
			right: null
		};
		const dataList = _.map(data, (color, key) => {
			const selected = color.is_selected ? <Svg src='ico_check.svg' /> : <Svg src='ico_empty.svg' />;
			return (
				<Button key={key} align='left' wide onClick={(e) => this.onClick(e, color)}>
					<List.Content className='padding--medium-v'>
						<div className='flex-row flex-middle'>
							{renderIf(isHexColor(color.colorcode))(
								<Badge circle colorCode={color.colorcode} size='medium' filter={color} />
							)}
							{renderIf(!isHexColor(color.colorcode))(
								<img height='30px' width='30px' src={color.colorcode} alt='color' />
							)}
							<span className='margin--medium-l'>{color.facetdisplay}</span><span className='font-color--primary-ext-2 margin--small-l'>({color.count})</span>
						</div>
						{selected}
					</List.Content>
				</Button>
			);
		});

		return (
			<div style={this.props.style}>
				<Page color='white' style={{ marginTop: '15px' }}>
					<List>
						{dataList}
					</List>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action resetDisabled={resetDisabled} hasReset onReset={(e) => this.reset(e)} hasApply onApply={(e) => this.onApply(e)} />
			</div>
		);
	}
}

export default Color;
