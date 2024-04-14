import {useState, useRef} from 'react'

const inputType = {
	number: 'number',
	string: 'text',
	password: 'password',
}

export default function useForm(submitHandle, initialValues) {
	const [values, setValues] = useState(initialValues || {});
	const allowValidate = useRef(false);
	const [errors, setErrors] = useState({});
	const errorsRuntime = useRef({});

	const handleChange = (ev) => {
		ev.persist();
		setValues(state => ({
			...state,
			[ev.target.id]: ev.target.value
		}))
		if (!allowValidate.current) return;
		validation(ev?.target);
	}

	const validationAll = () => {
		const allValues = Object.keys(values);
		let validAll = true;
		for (const item of allValues) {
			const validationElement = document.getElementById(item);
			if (!validationElement) continue;
			validAll &= validation(validationElement);
		}

		return validAll;
	}
	const validation = (inputElement) => {
		switch (inputElement?.type) {
			case inputType.string || inputType.password:
				if (!requireValidation(inputElement)) return false;
				if (!minValidation(inputElement)) return false;
				if (!maxValidation(inputElement)) return false;
				if (!emailValidation(inputElement)) return false;
				break;
			default:
				break;
		}
		// clear error
		clearError(inputElement)
		return true;
	}
	const clearError = (inputElement) => {
		const newErrors = {...errorsRuntime.current};
		delete newErrors[inputElement.id];
		setErrors(newErrors);
		errorsRuntime.current = newErrors;
	}
	const addErrors = (inputElement, errorString) => {
		const newErrors = {
			...errorsRuntime.current,
			[inputElement.id]: errorString
		};
		errorsRuntime.current = newErrors;
		setErrors(newErrors);
	}
	const requireValidation = (inputElement) => {
		const requireArray = JSON.parse(inputElement?.dataset?.require || '[]');
		const requireValid = inputElement?.value?.length || inputElement?.value?.length > 0
		if (requireValid) return true;
		const [, errorMessage] = requireArray;
		if (!inputElement.value) {
			addErrors(inputElement, errorMessage)
			return false;
		}
		return true;
	}
	const minValidation = (inputElement) => {
		const minArray = JSON.parse(inputElement?.dataset.min || '[]');
		if (minArray.length <= 0) return true;
		const [minNumber, errorMessage] = minArray;
		const minValid = inputElement?.value && inputElement?.value?.length >= minNumber;
		if (minValid) {
			return true;
		} else if (!minValid) {
			addErrors(inputElement, errorMessage)
			return false;
		}
	}
	const maxValidation = (inputElement) => {
		const maxArray = JSON.parse(inputElement?.dataset.max || '[]');
		if (maxArray.length <= 0) return true;
		const [maxNumber, errorMessage] = maxArray;
		const maxValid = inputElement?.value && inputElement?.value?.length <= maxNumber;
		if (maxValid) {
			return true;
		} else if (!maxValid) {
			addErrors(inputElement, errorMessage)
			return false;
		}
	}
	const emailValidation = (inputElement) => {
		const maxArray = JSON.parse(inputElement?.dataset.email || '[]');
		if (maxArray.length <= 0) return true;
		const [, errorMessage] = maxArray;
		const emailValid = isValidEmail(inputElement?.value);
		if (emailValid) {
			return true;
		} else if (!emailValid) {
			addErrors(inputElement, errorMessage)
			return false;
		}
	}
	const isValidEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	const onSubmit = (ev) => {
		ev.preventDefault();
		let valid = true;
		allowValidate.current = true;
		allowValidate.current && (valid = validationAll());
		valid && submitHandle(values, ev);
	}
	const register = (name) => {
		if (!Object.keys(values).find((item) => item === name)) {
			setValues((state) => ({
				...state,
				[name]: '',
			}));
		}
		return {
			onChange: handleChange,
			id: name
		}
	}

	return [register, onSubmit, errors];
}