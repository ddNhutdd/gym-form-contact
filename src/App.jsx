import useForm from "./useForm.js";
import css from './ass.module.scss';

function App() {
	const submitHandle = (values, ev) => {
		alert('Add contact successfully!!!')
	}
	const [register, onSubmit, errors] = useForm(submitHandle);
	const errorClassRender = (error) => {
		return error ? css.error : '';
	}

	return (
		<div>
			<form onSubmit={onSubmit}>
				<h1>Contact Form</h1>
				<div className={css.field}>
					<label htmlFor={`name`}>
						Name
					</label>
					<input
						type="text"
						data-require={JSON.stringify([true, 'Require'])}
						data-min={JSON.stringify([3, 'Too Short'])}
						data-max={JSON.stringify([6, 'Too Long'])}
						{...register('name')}
						className={errorClassRender(errors.name)}
					/>
					<div className={errorClassRender(errors.name)}>
						{errors.name}
					</div>

				</div>
				<div className={css.field}>
					<label htmlFor={`email`}>
						Email
					</label>
					<input
						type="text"
						data-require={JSON.stringify([true, 'Require'])}
						data-email={JSON.stringify([true, 'Email Invalid'])}
						{...register('email')}
						className={errorClassRender(errors.email)}
					/>
					<div className={errorClassRender(errors.email)}>
						{errors.email}
					</div>
				</div>
				<div className={css.field}>
					<label htmlFor={`phone`}>
						Phone
					</label>
					<input
						type="text"
						{...register('phone')}
						data-require={JSON.stringify([true, 'Require'])}
						className={errorClassRender(errors['phone'])}
					/>
					<div className={errorClassRender(errors['phone'])}>
						{errors["phone"]}
					</div>
				</div>
				<div className={css.field}>
					<label htmlFor={`phone`}>
						Message
					</label>
					<textarea
						rows="3"
						cols="5"
						{...register('message')}
					>

					</textarea>

				</div>
				<button type={"submit"}>Submit</button>
			</form>
		</div>
	)
}

export default App
