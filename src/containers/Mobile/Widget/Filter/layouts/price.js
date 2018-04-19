import React, { PureComponent } from 'react';
import { Button, Header, Page, Svg, Slider, Input } from '@/components/mobile';
// import { Link } from 'react-router-dom';
import styles from './price.scss';
import Action from './action';
import _ from 'lodash';
import utils from './utils';
import handler from '@/containers/Mobile/Shared/handler';

@handler
class Price extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			range: {
				min: parseInt(props.range.min, 10),
				max: parseInt(props.range.max, 10),
			},
			selectedRange: {
				min: props.selected !== undefined ? parseInt(props.selected.min, 10) : parseInt(props.range.min, 10),
				max: props.selected !== undefined ? parseInt(props.selected.max, 10) : parseInt(props.range.max, 10),
			},
			custom: false,
			data: props.data || [],
			resetDisabled: utils.getSelected(props.data).length < 1
		};
		this.state.resetRangeData = _.cloneDeep(this.state.range);
		this.state.resetSelectedRangeData = _.cloneDeep(this.state.selectedRange);
	}

	onClick(e, value) {
		let { data } = this.state;
		data = _.map(data, (facetData) => {
			if (facetData.facetrange === value.facetrange) {
				facetData.is_selected = facetData.is_selected === 1 ? 0 : 1;
			}
			return facetData;
		});

		this.setState({
			custom: false,
			data
		});
	}

	onApply(e) {
		const { data, selectedRange, custom } = this.state;
		const { onApply } = this.props;
		const result = _.filter(data, (facetData) => {
			return (facetData.is_selected === 1);
		});
		if (custom) {
			return onApply(e, null, {
				...selectedRange,
				facetdisplay: `${utils.toIdr(selectedRange.min)} - ${utils.toIdr(selectedRange.max)}`
			});
		}
		return onApply(e, result, false);
	}

	updateRange(value, changes) {
		const currentRange = this.state.range;
		const { range } = this.props;
		if (changes === 'min') {
			if (value.min > currentRange.max) {
				return;
			}
		} else if (changes === 'max') {
			if (value.max < currentRange.min) {
				return;
			}
		}
		const updatedValue = {
			...currentRange,
			...value
		};
		this.setState({
			resetDisabled: false,
			custom: true,
			selectedRange: {
				min: Math.abs(updatedValue.min) < parseInt(range.max, 10) ? Math.abs(updatedValue.min) : parseInt(range.min, 10),
				max: Math.abs(updatedValue.max) < parseInt(range.max, 10) ? Math.abs(updatedValue.max) : parseInt(range.max, 10),
			}
		});
	}

	reset(e) {
		const { resetRangeData, resetSelectedRangeData } = this.state;
		this.setState({
			resetDisabled: true,
			range: _.cloneDeep(resetRangeData),
			selectedRange: _.cloneDeep(resetSelectedRangeData),
		});
		this.props.onReset(e);
	}

	render() {
		const { onReset, range, title } = this.props;
		const { resetDisabled } = this.state;
		const HeaderPage = {
			left: (
				<Button onClick={(e) => onReset(e, true)}>
					<Svg src='ico_arrow-back-left.svg' />
				</Button>
			),
			center: _.capitalize(title) || 'Default',
			right: null
		};

		// const selectedRange = this.state.selectedRange ? this.state.selectedRange : this.state.range;

		return (
			<div style={this.props.style}>
				<Page color='white' style={{ marginTop: '15px' }}>
					<div className={styles.priceSlider}>
						<div className='padding--medium-h'>
							<Slider min={parseInt(range.min, 10)} max={parseInt(range.max, 10)} value={this.state.selectedRange} onChange={(value) => this.updateRange(value)} />
							<div className={styles.sliderInfo}>
								<span>min</span>
								<span>max</span>
							</div>
						</div>
					</div>
					<div className={styles.priceInput}>
						<div className='flex-row padding--medium-h flex-spaceBetween margin--medium-v margin--none-t flex-middle'>
							<div style={{ width: '45%' }}>
								<Input value={this.state.selectedRange.min} ref={c => { this.rangeMin = c; }} onChange={(event) => { this.updateRange({ min: parseInt(event.target.value, 10) }, 'min'); }} type='number' placeholder='Min price' />
							</div>
							<div>-</div>
							<div style={{ width: '45%' }}>
								<Input value={this.state.selectedRange.max} ref={c => { this.rangeMax = c; }} onChange={(event) => { this.updateRange({ max: parseInt(event.target.value, 10) }, 'max'); }} type='number' placeholder='Max price' />
							</div>
						</div>
					</div>
					{/* <div className={styles.action}>
						<Button wide size='medium' outline color='secondary'>App Only</Button>
					</div> */}
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action resetDisabled={resetDisabled} hasReset onReset={(e) => this.reset(e)} hasApply onApply={(e) => this.onApply(e)} />
			</div>
		);
	}
}

export default Price;
