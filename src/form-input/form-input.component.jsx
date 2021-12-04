import './form-input.styles.scss';

import { connect } from 'react-redux';

const FormInput = ({ isSignedIn, type, labelText, onChange, value, inputStyle, name}) => {

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

const mapStateToProps = ({isSignedIn}) => ({
    isSignedIn: isSignedIn.isSignedIn
})


export default connect(mapStateToProps)(FormInput)