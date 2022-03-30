import React, { Component } from 'react';

export default class HiddenInput extends Component {
	render() {
        const {
            html_attr,
            validate,
            required,
            title,
            type,
            value,
            options,
            readonly: readOnly
            
        } = this.props.data.field;
        const {key} = this.props.data;
        const { class: className, ...rest } = html_attr;
		const {errors} = this.props;
		return (
			<>
				<input
					name={key}
					{...{
						className: className && className,
					}}
					{...rest}
					{...{ type }}
					{...{ value }}
					{...{ required }}
					{...{ readOnly }}
				/>
			</>
		);
	}
}
