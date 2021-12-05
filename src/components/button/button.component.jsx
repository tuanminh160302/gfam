import './button.styles.scss';

const Button = ({className, type, text, ...otherProps}) => {
    return (
        <button   
            className={`${className} button`} 
            type={type}
            {...otherProps}>
            {text}
        </button>
    )
}

export default Button;