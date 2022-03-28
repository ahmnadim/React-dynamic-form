import React, { Component } from 'react';
import { extractValidateRules } from '../pages/form';

export default class RepeaterInput extends Component {

    state = {
        repeater: [],
        singleInstance: null
    }

    componentDidMount(){
        const {repeater_fields, validate
		} = this.props.data.field;

        this.setState({...this.state, repeater: [repeater_fields], singleInstance: repeater_fields})
    }

    onChangeHandler = (e) => {
        const name = e.target.name;
		const value = e.target.value;
		const { validate
		} = this.props.data.field;
		const validationRules = extractValidateRules(validate)
		console.log(name, value, validationRules);

    }

    addAnotherWork = (e) => {
        e.preventDefault()
        const singleBlock = {...this.state.singleInstance}
        const multipleBlock = [...this.state.repeater]
        multipleBlock.push(singleBlock)
        this.setState({...this.state, repeater: multipleBlock})
    }

    removeOne = (repeaterIndex) => {
        console.log(repeaterIndex);
        const singleBlock = {...this.state.singleInstance}
        const multipleBlock = [...this.state.repeater]
        if(multipleBlock.length === 1) return false;
        this.setState({...this.state, repeater: multipleBlock.filter((item, i) => i !== repeaterIndex)})
    }

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
        const {repeater} = this.state;

		return (
			<>
				<div className='form-group'>
					{repeater.map((item, repeaterIndex) => {
                        return (
                            <span key={`repeater-${repeaterIndex}`} className="single-block">
                            {repeaterIndex !== 0 && <span className='close-btn' onClick={() => this.removeOne(repeaterIndex)}>X</span>}
                            {Object.entries(repeater_fields).map(([key, field], index) => {
						return (
							<span key={`single-block-${index}`} >
								<label htmlFor={rest.id}>{field.title}</label>
								<input
									name={key}
									onChange={this.onChangeHandler}
									{...{
										className: className && className + ' form-control',
									}}
									{...rest}
									{...{ type:  field.type}}
                                    {...{id:rest.id}}
									{...{ value }}
									{...{ required }}
								/>
							</span>
						);
					})}
                        
                            </span>
                        )
                    })}
                    <button className='btn btn-primary ' onClick={this.addAnotherWork}>Add</button>

				</div>
			</>
		);
	}
}


const emptyHobby = [{
    work: "",
    designation: ""
}]
