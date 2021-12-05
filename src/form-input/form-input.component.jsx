import { useRef, useEffect } from 'react';
import './form-input.styles.scss';

import { connect } from 'react-redux';

const FormInput = ({ isSignedIn, inputFieldType, type, labelText, onChange, value, inputStyle, name}) => {

    const inputRef = useRef()

    useEffect(() => {
        inputRef.current.value = ""
    }, [inputFieldType])

    return (
        <div className='group'>
            <input ref={inputRef} value={value} className={`input-field ${inputStyle}`} type={type} onChange={onChange} name={name} required/>
            {
                labelText ?
                (<label className={`${value.length ? 'shrink' : ''} input-label`}>{labelText}</label>)
                : null
            }

        </div>
    )
}

const mapStateToProps = ({isSignedIn}) => ({
    isSignedIn: isSignedIn.isSignedIn,
    inputFieldType: isSignedIn.inputFieldType
})

export default connect(mapStateToProps)(FormInput)