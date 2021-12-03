import './button.styles.scss';

const Button = ({type, text, background, onClick, color, textSize, padding}) => {
    return (
        <span   
            className="button" 
            type={type}
            style={{
                    background: `${background}`, 
                    color: `${color}`, 
                    fontSize: `${textSize}`, 
                    padding: `${padding}`}} 
            onClick={onClick}>
            {text}
        </span>
    )
}

export default Button