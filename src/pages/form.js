import React, { Component } from 'react';
import TextareaInput from '../components/textareaInput';
import TextInput from '../components/textInput';
import SelectInput from '../components/selectInput';
import RadioInput from '../components/radioInput';
import RepeaterInput from '../components/repeaterInput';
import { validator } from '../hepers/validation';
import HiddenInput from '../components/hidden';

export default class componentName extends Component {
	state = {
		FormData: null,
		fields: null,
		values: null,
		errors: null,
	};
	async componentDidMount() {
		const res = await fetch('http://localhost/api/get_form.php');
		const data = await res.json();
		console.log(data);
		this.setState({ FormData: data, fields: data.data.fields[0] });
	}

	// componentDidUpdate(prevProps){
	//     console.log(prevProps);
	// }

	onChangeHandler = (e, field) => {
		const {name, value} = e.target;

		const { validate } = field;
		const validationRules = extractValidateRules(validate);
		
		const isValid = validator(e, field, validationRules)
		console.log("form: ", name, value, validationRules, isValid);

		this.setState({
			...this.state,
			fields: {
				...this.state.fields,
				[name]: { ...this.state.fields[name], value },
			},
			errors: {...this.state.errors, ...isValid}
		});

	};

	repeaterOnchangeHandler = ({value, errors}) => {
		const _errors = {...this.state.errors}
		let _repeater = []
		if(Object.keys(_errors).includes('repeater')){
			_repeater = [..._repeater, ..._errors.repeater]
			
		}
		const _repIndex = Object.keys(errors.repeater)[0];
		const singleError = {..._repeater[_repIndex], ...errors.repeater[_repIndex]}
		const err = [..._repeater]
		err[_repIndex] = singleError
		_errors.repeater = err;
		

		this.setState({...this.state, errors: {...this.state.errors,  ..._errors}})
	}

	onSubmitHandler = (e) => {
		e.preventDefault();
		console.log(e.target);
	};

	render() {
		const { fields, errors } = this.state;
		if (!fields) return <h2>No fields yet.</h2>;
		console.log('fields: ', fields);
		return (
			<>
				<form onSubmit={this.onSubmitHandler}>
					{Object.entries(fields).map(([key, field], index) => {
						const {
							html_attr,
							validate,
							required,
							title,
							type,
							value,
							options,
						} = field;
						{
							/* const { class: className, ...rest } = html_attr; */
						}
						return (
							<span key={index}>
								<div className='form-group'>
									{/* <label htmlFor={rest?.id}>{field.title}</label> */}

									{field.type == 'hidden' ? (
										<HiddenInput
											data={{ field, key }}
										/>
									) : null}

									{field.type == 'select' ? (
										<SelectInput
											data={{ field, key }}
											handler={this.onChangeHandler}
										/>
									) : null}

									{field.type == 'radio' ? (
										<RadioInput
											data={{ field, key }}
											handler={this.onChangeHandler}
										/>
									) : null}

									{['text', 'email', 'password'].includes(field.type) ? (
										<TextInput
											data={{ field, key }}
											handler={this.onChangeHandler}
											errors={errors}
										/>
									) : null}

									{field.type == 'textarea' ? (
										<TextareaInput
											data={{ field, key }}
											handler={this.onChangeHandler}
											errors={errors}
										/>
									) : null}

									{field.type == 'repeater' ? (
										<RepeaterInput
											data={{ field, key }}
											handler={this.repeaterOnchangeHandler}
											errors={errors}
										/>
									) : null}
								</div>
							</span>
						);
					})}

					<input
						type='submit'
						className='btn btn-primary mb-2 mt-2 float-right'
						value='Submit'
					/>
				</form>
			</>
		);
	}
}

export const extractValidateRules = (validateString) => {
	if (!validateString || validateString.length == 0) return null;
	return validateString.split('|');
};
