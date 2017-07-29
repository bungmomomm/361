import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './Box.scss';
import Accordion from './BoxAccordion';

const cx = classNames.bind(styles);

export default class Box extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			accordion: false
		};
	}

	handleToggle() {
		if (this.props.accordion) {
			this.setState({
				accordion: !this.state.accordion
			});
		}
	}
	
	render() {
		const boxClass = cx({
			box: true,
			row: !!this.props.row,
			accordion: !!this.props.accordion
		});
		return (
			<div role='button' className={boxClass}>
				{
					this.props.accordion ? [
						this.props.children[0],
						<Accordion shown={this.state.accordion} >{this.props.children[1].props.children}</Accordion>]
					: 
					this.props.children
				}
			</div>
		);
	}
};

Box.Accordion = Accordion;