import React, { Component } from 'react';
import { Modal, Panel, Radio } from 'mm-ui';

export default class ModalChooseAddress extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	checkSelected(address) {
		return this.props.selectedAddress.id === address.value;
	}

	render() {
		if (!this.props.address) {
			return null;
		}
		return (
			<Modal showOverlayCloseButton size='medium' show={this.props.open} onCloseRequest={this.props.handleClose}>
				<Modal.Header>Daftar Alamat</Modal.Header>
				<Modal.Body>
					{
						this.props.address.map((address, index) => {
							const isChecked = this.checkSelected(address);
							return (
								<Panel 
									key={index} 
									color={isChecked ? 'yellow' : 'grey'}
									onClick={() => this.props.onChange(address)}
									header={
										<Radio 
											inverted={isChecked}
											data={[
												{ 
													label: isChecked ? 'Alamat Utama' : 'Gunakan Alamat ini', 
													inputProps: { 
														readOnly: true,
														checked: isChecked
													} 
												}
											]} 
										/>
									}
								>
									<div dangerouslySetInnerHTML={{ __html: address.info }} />
								</Panel>
							);
						})
					}
				</Modal.Body>
			</Modal>
		);
	}
}