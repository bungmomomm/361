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
		this.onBlurInputMaxPrice = this.onBlurInputMaxPrice.bind(this);
		this.onBlurInputMinPrice = this.onBlurInputMinPrice.bind(this);
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
		const { onApply, range } = this.props;
		const result = _.filter(data, (facetData) => {
			return (facetData.is_selected === 1);
		});
		if (custom) {
			return onApply(e, null, {
				...selectedRange,
				facetdisplay: `${utils.toIdr(selectedRange.min)} - ${utils.toIdr(selectedRange.max)}`
			});
		}
		
		let thirdParameter = false;
		// Add the third parameter if selected range is not equal with min and max props we defined before
		if ((range.min !== selectedRange.min) && (range.max !== selectedRange.max)) {
			thirdParameter = {
				...selectedRange,
				facetdisplay: `${utils.toIdr(selectedRange.min)} - ${utils.toIdr(selectedRange.max)}`
			};
		}
		
		return onApply(e, result, thirdParameter);
  
	}
	
	onBlurInputMinPrice(event) {
		// The selected range may consist of the value that we have applied or the value we just blur from text input but not applied yet.
		const { selected, range } = this.props;
		const { selectedRange } = this.state;
		const minValue = selected !== undefined ? parseInt(selected.min, 10) : parseInt(range.min, 10);
		let maxValue = selected !== undefined ? parseInt(selected.max, 10) : parseInt(range.max, 10);
		const value = event.target.value;
		const stateObject = {};
		// Define the default selected range. If there is selected then apply for it otherwise takes
		// from default allowed minimum and maximum which is set from props
		stateObject.selectedRange = {
			min: minValue,
			max: maxValue
		};
		// If we key in the text inside input then
		if (value !== '') {
			// Overwrite the max value if the value is not equal with latest update or default max value from props
			if (parseInt(selectedRange.max, 10) !== maxValue) {
				maxValue = parseInt(selectedRange.max, 10);
			}
			// Do update directly
			stateObject.selectedRange = {
				min: parseInt(value, 10),
				max: maxValue
			};
			// Otherwise prevent the update if the value is greater than allowed min
			// Also if selected value is greater than selected max revert it
			if (parseInt(value, 10) < parseInt(this.props.range.min, 10) || parseInt(value, 10) > maxValue) {
				stateObject.selectedRange = {
					min: minValue,
					max: maxValue
				};
			}
		}
		this.setState(stateObject);
	}
	
	onBlurInputMaxPrice(event) {
		const { selected, range } = this.props;
		const { selectedRange } = this.state;
		let minValue = selected !== undefined ? parseInt(selected.min, 10) : parseInt(range.min, 10);
		const maxValue = selected !== undefined ? parseInt(selected.max, 10) : parseInt(range.max, 10);
		const value = event.target.value;
		
		const stateObject = {};
		stateObject.selectedRange = {
			min: minValue,
			max: maxValue
		};
		
		if (value !== '') {
			if (parseInt(selectedRange.min, 10) !== minValue) {
				minValue = parseInt(selectedRange.min, 10);
			}
			stateObject.selectedRange = {
				min: minValue,
				max: parseInt(value, 10)
			};
			// Also compare if the value is less than selected range from min
			if (parseInt(value, 10) > parseInt(this.props.range.max, 10) || parseInt(value, 10) < minValue) {
				stateObject.selectedRange = {
					min: minValue,
					max: maxValue
				};
			}
		}
		
		this.setState(stateObject);
	}
	
	
	updateRange(value, changes = 'slider') {
		
		const currentRange = this.state.range;
		const { range } = this.props;
		
		const updatedValue = {
			...currentRange,
			...value
		};
		
		const objectState = {
			resetDisabled: false,
			custom: true,
			selectedRange: {
				min: Math.abs(updatedValue.min) < parseInt(range.max, 10) ? Math.abs(updatedValue.min) : parseInt(range.min, 10),
				max: Math.abs(updatedValue.max) < parseInt(range.max, 10) ? Math.abs(updatedValue.max) : parseInt(range.max, 10),
			}
		};
		
		// Keep the value updated for input text. Because the validation is done via onblur
		if (changes !== 'slider') {
			objectState.selectedRange = {
				min: Math.abs(updatedValue.min),
				max: Math.abs(updatedValue.max),
			};
		}
		
		this.setState(objectState);
		
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
								<Input
									value={this.state.selectedRange.min}
									ref={c => { this.rangeMin = c; }}
									onChange={
												(event) => {
													this.updateRange(
														{
															min: parseInt(event.target.value, 10),
															max: parseInt(this.state.selectedRange.max, 10)
														}, 'min');
												}
											}
									placeholder='Min price'
									onBlur={this.onBlurInputMinPrice}
								/>
							</div>
							<div>-</div>
							<div style={{ width: '45%' }}>
								<Input
									value={this.state.selectedRange.max}
									ref={c => { this.rangeMax = c; }}
									onChange={
										(event) => {
											this.updateRange(
												{
													min: parseInt(this.state.selectedRange.min, 10),
													max: parseInt(event.target.value, 10)
												}, 'max');
										}}
									placeholder='Max price'
									onBlur={this.onBlurInputMaxPrice}
								/>
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
