import './form-input.styles.scss';

const FormInput = ({ type, labelText, onChange, value, inputStyle, name, ...otherProps}) => {
    return (
        <div className='group'>
            <input className={`input-field ${inputStyle}`} type={type} onChange={onChange} name={name} {...otherProps}/>
            {
                labelText ?
                (<label className={`${value.length ? 'shrink' : ''} input-label`}>{labelText}</label>)
                : null
            }

        </div>
    )
}


export default FormInput