import React, { Component } from 'react';
import { validator } from '../hepers/validation';
import { extractValidateRules } from '../pages/form';

export default class RepeaterInput extends Component {
	state = {
		repeater: [],
		singleInstance: null,
		value: [],
		validate: '',
	};

	componentDidMount() {
		const { repeater_fields, validate } = this.props.data.field;
		const fieldsValues = extractValues(repeater_fields);
		console.log('fields: ', fieldsValues);
		this.setState({
			...this.state,
			repeater: [],
			singleInstance: repeater_fields,
			value: [],
			validate: validate
		});
	}

	onChangeHandler = (e, repeaterIndex, fieldName) => {
		const { name, value } = e.target;
		const fields = [...this.state.repeater];
		const singleBlock = fields[repeaterIndex];
		const field = singleBlock[fieldName];
		const { validate } = this.state;

		const validationRules = extractValidateRules(validate);
		const isValid = validator(e, field, validationRules);

		const errors = {repeater: []}
		const err = []
		errors.repeater[repeaterIndex] = isValid;
		
		const _value = [...this.state.value];
		_value[repeaterIndex][fieldName] = value;
		
		this.props.handler({value: _value, errors})
		this.setState({
			...this.state,
			repeater: [...this.state.repeater],
			value: _value,
		});
	};

	addAnotherWork = (e) => {
		e.preventDefault();
		const singleBlock = { ...this.state.singleInstance };
		const multipleBlock = [...this.state.repeater];

		const { repeater_fields, validate } = this.props.data.field;
		const fieldsValues = extractValues(repeater_fields);

		multipleBlock.push(singleBlock);
		this.setState({
			...this.state,
			repeater: multipleBlock,
			value: [...this.state.value, ...fieldsValues],
		});
	};

	removeOne = (repeaterIndex) => {
		const singleBlock = { ...this.state.singleInstance };
		const multipleBlock = [...this.state.repeater];
		const _values = [...this.state.value];

		// if (multipleBlock.length === 1) return false;
		this.setState({
			...this.state,
			repeater: multipleBlock.filter((item, i) => i !== repeaterIndex),
			value: _values.filter((item, i) => i !== repeaterIndex),
		});
	};

	render() {
		const {
			html_attr,
			validate,
			required,
			title,
			type,
			value,
			options,
			repeater_fields,
		} = this.props.data.field;
		const { key } = this.props.data;
		const { class: className, ...rest } = html_attr;
		const { repeater, value: values } = this.state;

		return (
			<>
				<div className='form-group'>
				<label>{title}</label><br />
					{repeater.map((item, repeaterIndex) => {
						return (
							<span key={`repeater-${repeaterIndex}`} className='single-block'>
								{
									<span
										className='close-btn'
										onClick={() => this.removeOne(repeaterIndex)}
									>
										X
									</span>
								}
								{Object.entries(repeater_fields).map(([key, field], index) => {
									return (
										<span key={`single-block-${index}`}>
											<label htmlFor={rest.id}>{field.title}</label>
											<input
												name={key}
												onChange={(e) =>
													this.onChangeHandler(e, repeaterIndex, key)
												}
												{...{
													className: className && className + ' form-control',
												}}
												{...rest}
												{...{ type: field.type }}
												{...{ id: rest.id }}
												value={values[repeaterIndex][key]}
												{...{ required }}
											/>
										</span>
									);
								})}
							</span>
						);
					})}
					<button className='btn btn-primary' onClick={this.addAnotherWork}>
						Add
					</button>
				</div>
			</>
		);
	}
}

const emptyHobby = [
	{
		work: '',
		designation: '',
	},
];

export const extractValues = (repeater_fields) => {
	const values = {};
	const fields = [];
	Object.keys(repeater_fields).map((item) => {
		values[item] = '';
		return { [item]: '' };
	});
	fields.push(values);

	return fields;
};
