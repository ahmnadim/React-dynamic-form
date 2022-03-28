import React, { Component } from 'react';

export default class SelectInput extends Component {
	render() {
		const { html_attr, validate, required, title, type, value, options } =
			this.props.data.field;
		const { key } = this.props.data;
		const { class: className, ...rest } = html_attr;

		return (
			<>
				{' '}
				<select
					name={key}
					{...{ className: className + ' form-control' }}
					{...rest}
					{...{ required }}
					onChange={(e) => this.props.handler(e, this.props.data.field)}
				>
					<option key={`opI-`} disabled>
						{'Select one...'}
					</option>
					{options.map((option, opIndex) => {
						return (
							<option key={`opI-${opIndex}`} {...{ value: option.value }}>
								{option.label}
							</option>
						);
					})}
				</select>{' '}
			</>
		);
	}
}
