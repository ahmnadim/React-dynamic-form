import React, { Component } from 'react';

export default class RadioInput extends Component {
	render() {
		const { html_attr, validate, required, title, type, value, options, default: defaultValue } =
			this.props.data.field;
		const { key } = this.props.data;
		const { class: className, ...rest } = html_attr;

		return (
			<>
				<div className='form-check'>
					{options.map((option, opIndex) => {
						return (
							<span key={option.key}>
								<input
									name={key}
									onChange={(e) => this.props.handler(e, this.props.data.field)}
									{...{
										className: className && className + ' form-check-input',
									}}
									{...rest}
									id={option.key}
									{...{ type }}
									{...{ value: option.key }}
									{...{ required }}
									defaultChecked={value != ""? value == option.key  : defaultValue == option.key}
								/>
                                {/* FIXME api response have one single id for multiple radio button... as [rest.id] */}
								<label className='form-check-label' htmlFor={option.key} >
									{option.label}
								</label><br />
							</span>
						);
					})}
				</div>
			</>
		);
	}
}
