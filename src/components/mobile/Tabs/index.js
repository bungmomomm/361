import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Tab from './Tab';
import styles from './tab.scss';

class Tabs extends PureComponent {
	constructor(props) {
		super(props);
		this.handleScroll = this.handleScroll.bind(this);
		this.state = {
			sticky: false
		};
	}
	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll, true);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll, true);
	}

	handleScroll(e) {
		const { sticky } = this.state;
		if (this.props.isSticky) {
			if (e.target.scrollTop > 300 && !sticky) {
				this.setState({ sticky: true });
			}
			if (e.target.scrollTop < 300 && sticky) {
				this.setState({ sticky: false });
			}
		}
	}

	render() {
		const { current, variants, className, type, onPick, style } = this.props;
		const createClassName = classNames(
			styles.container,
			className,
			this.state.sticky ? styles.sticky : '',
			styles[type]
		);

		const tabs = variants.map(({ id, title, key, disabled }, idx) => {
			const active = key === current;
			return (
				<Tab
					id={id}
					key={idx}
					title={title}
					active={active}
					disabled={disabled}
					onPick={onPick}
				/>
			);
		});

		return (
			<ul className={createClassName} style={style}>
				{tabs}
			</ul>
		);
	}
}

export default Tabs;
