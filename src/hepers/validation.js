const only_letters = /^[A-Za-z]+$/;
const only_numbers = /^\d+$/;
const only_letter_number = /^[a-z0-9]+$/i;
const email = /\S+@\S+\.\S+/;

export const validator = (e, field, rules) => {
	const { name, value } = e.target;
	const { validate, title, required } = field;

	const ifNeedValidation = decideIfNeedValidation(e, field, rules);
	if (Object.keys(ifNeedValidation).length === 0) return null;

	const validationObj = {};
	const length = rules.length;

	// if (!rules || rules.length === 0) return null;
	if (required && (!value || value.length === 0)) {
		validationObj[name] =
			required && value.length === 0 ? `${title} is a Required field.` : '';
		return validationObj;
	}

	for (let i = 0; i < length; i++) {
		if (String(rules[i]).includes(':')) {
			const _rule = rules[i].split(':');
			const __rule = { [_rule[0]]: _rule[1] };
			const _keys = Object.keys(__rule);
			if (value.length < __rule['min']) {
                validationObj[name] = `${title} minimum limit not fulfilled.`;
			}
			if (value.length >= __rule['max']) {
				validationObj[name] = `${title} max limit exceeded.`;
			}
            continue;
		}

		switch (rules[i]) {
			case 'only_letters':
				validationObj[name] = !only_letters.test(value)
					? `${title} supports only letters.`
					: '';
				break;

			case 'only_letter_number':
				validationObj[name] = !only_letter_number.test(value)
					? `${title} supports only letters and numbers.`
					: '';
				break;

			case 'email':
				validationObj[name] =
					email.test(value) === false
						? `${title} supports only valid E-mail.`
						: '';
				break;

			default:
				validationObj[name] =
					required && value.length === 0 ? `${title} is a Required field.` : '';
				break;
		}
	}

	return validationObj;
};

const validationRules = [
	'only_letters',
	'integers',
	'only_letter_number',
	'min:5',
	'max:100',
	'email',
	'|max:200',
];

const decideIfNeedValidation = (e, field, rules) => {
	const { name, value } = e.target;
	const { validate, title, required } = field;

	const status = {};

	if (required) status[required] = true;
	if (validate) status[validate] = true;

	return status;
};
