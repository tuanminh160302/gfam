import './button.styles.scss';

const Button = ({type, text, background, color, textSize, margin, padding, ...otherProps}) => {
    return (
        <button   
            className="button" 
            type={type}
            style={{
                    background: `${background}`, 
                    color: `${color}`, 
                    fontSize: `${textSize}`, 
                    padding: `${padding}`,
                    margin: `${margin}`
                }} 
            {...otherProps}>
            {text}
        </button>
    )
}

export default Button;