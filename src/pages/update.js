import React, { Component } from 'react';
import withRouter from '../components/withRouter';
import TextareaInput from '../components/textareaInput';
import TextInput from '../components/textInput';
import SelectInput from '../components/selectInput';
import RadioInput from '../components/radioInput';
import RepeaterInput from '../components/repeaterInput';
import { validator } from '../helpers/validation';
import HiddenInput from '../components/hidden';
import { api_form_submit, api_get_form } from '../helpers/apiEndpoints';
import { extractValidateRules } from './form';

class Update extends Component {
	state = {
		FormData: null,
		fields: null,
		values: null,
		errors: null,
		loading: false,
	};

	async componentDidMount() {
		const userId = this.props.params.id;
		const url = `${api_get_form}?id=${userId}`;
		const res = await fetch(url);
		const data = await res.json();
		this.setState({ FormData: data, fields: data.data.fields[0] });
	}

	onChangeHandler = (e, field) => {
		const { name, value } = e.target;

		const { validate } = field;
		const validationRules = extractValidateRules(validate);

		const isValid = validator(e, field, validationRules);
		this.setState({
			...this.state,
			fields: {
				...this.state.fields,
				[name]: { ...this.state.fields[name], value },
			},
			errors: { ...this.state.errors, ...isValid },
		});
	};

	repeaterOnchangeHandler = ({ value, errors }) => {
		const _errors = { ...this.state.errors };
		let _repeater = [];
		if (Object.keys(_errors).includes('repeater')) {
			_repeater = [..._repeater, ..._errors.repeater];
		}
		const _repIndex = Object.keys(errors.repeater)[0];
		const singleError = {
			..._repeater[_repIndex],
			...errors.repeater[_repIndex],
		};
		const err = [..._repeater];
		err[_repIndex] = singleError;
		_errors.repeater = err;

		this.setState({
			...this.state,
			errors: { ...this.state.errors, ..._errors },
			values: value,
		});
	};

	onSubmitHandler = async (e) => {
		e.preventDefault();
		const check = this.checkForErrors();
		const required = this.checkForRequireErrors();
		let formValue = {};
		let requiredStatus = false;
		Object.entries(required).map(([key, value]) => {
			if (key == 'values') formValue = value;
			if (key == 'error') requiredStatus = value;
		});
		if (check || requiredStatus) {
			alert('Please fill the form properly.');
			return null;
		}
		try {
			this.setState({ loading: true });
			const res = await fetch(api_form_submit, {
				method: 'POST',
				body: { data: formValue },
			});
			const data = await res.json();
			this.setState({
				loading: false,
				msgs: data.messages,
				res_status: data.status,
			});
			setTimeout(() => {
				this.setState({ ...this.state, msgs: [] });
			}, 5000);
		} catch (err) {
			console.log('err: ', err);
			this.setState({ loading: false });
		}
	};

	checkForRequireErrors = () => {
		let status = { error: false };
		const _values = {};
		const _fields = { ...this.state.fields };
		Object.entries(_fields).map(([key, value]) => {
			Object.keys(value).map((_key) => {
				if (_key === 'value' && typeof value['value'] == 'string') {
					_values[key] = value[_key];
				}

				if (_key == 'required' && typeof value['value'] == 'string') {
					value['value'].length < 1 || value['value'] == ''
						? (status['error'] = true)
						: (status['error'] = false);
				}
				if (_key == 'required' && typeof value['value'] != 'string') {
					if (Array.isArray(value['value']) && this.state.values) {
						const _v = [...this.state.values];
						_values[key] = _v;
						_v.map((i) => {
							if (value.length < 1) {
								status['error'] = true;
							}
						});
					}
				}
			});
		});
		status['values'] = _values;

		return status;
	};

	checkForErrors = () => {
		let status = null;
		const errors = { ...this.state.errors };
		if (!errors) return null;
		Object.entries(errors).map(([key, value]) => {
			if (typeof value == 'object') {
				if (Array.isArray(value)) {
					value.map((item) => {
						if (item) {
							Object.keys(item).map((key) => {
								if (item[key].length !== 0) {
									status = { error: true };
								}
							});
						}
					});
				}
			}
			if (typeof value == 'string') {
				if (value.length !== 0) {
					status = { error: true };
				}
			}
		});
		return status;
	};

	render() {
		const { fields, errors } = this.state;
		if (!fields) return <h2>No fields yet.</h2>;
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
										<HiddenInput data={{ field, key }} />
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

					{this.state.loading ? (
						<div
							style={{ cursor: 'default' }}
							className={'btn black-bg-btn text-uppercase w-100'}
						>
							<div className='loader float-right '></div>
						</div>
					) : (
						<input
							type='submit'
							className='btn btn-primary mb-2 mt-2 float-right'
							value='Submit'
						/>
					)}
				</form>

				{this.state.msgs && Array.isArray(this.state.msgs) && (
					<div className='alert-container'>
						{this.state.msgs.map((msg, i) => {
							return (
								<p
									key={`${msg}-${i}`}
									className={
										this.state.res_status == 'success'
											? 'success-alert'
											: 'danger-alert'
									}
								>
									{msg}
								</p>
							);
						})}
					</div>
				)}
			</>
		);
	}
}

export default withRouter(Update);
