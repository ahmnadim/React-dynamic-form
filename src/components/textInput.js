import React, { Component } from 'react';

export default class TextInput extends Component {
	render() {
        const {
            html_attr,
            validate,
            required,
            title,
            type,
            value,
            options,
            
        } = this.props.data.field;
        const {key} = this.props.data;
        const { class: className, ...rest } = html_attr;
		const {errors} = this.props;
		return (
			<>
				<label htmlFor={rest.id}>{title}</label>
				<input
					name={key}
					onChange={(e) => this.props.handler(e, this.props.data.field)}
					{...{
						className: className && className + ' form-control',
					}}
					{...rest}
					{...{ type }}
					{...{ value }}
					{...{ required }}
				/>
				{errors && errors[key] && <span className='validation-error-msg'>{errors[key]}</span>}
			</>
		);
	}
}
