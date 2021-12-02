import './login-form.styles.scss';

const FormInput = ({ type, labelText, onChange, value, inputType, name }) => {
    return (
        <div className='group'>
            <input className={`input-field ${inputType}`} type={type} onChange={onChange} name={name} required/>
            {
                labelText ?
                (<label className={`${value.length ? 'shrink' : ''} input-label`}>{labelText}</label>)
                : null
            }
        </div>
    )
}


export default FormInput