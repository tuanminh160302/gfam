import './form-input.styles.scss';

const FormInput = ({ type, labelText, onChange, value, inputStyle, name }) => {
    return (
        <div className='group'>
            <input className={`input-field ${inputStyle}`} type={type} onChange={onChange} name={name} required/>
            {
                labelText ?
                (<label className={`${value.length ? 'shrink' : ''} input-label`}>{labelText}</label>)
                : null
            }
        </div>
    )
}


export default FormInput