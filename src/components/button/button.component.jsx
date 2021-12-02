import './button.styles.scss';

const Button = ({text, background, onClick, color, textSize, padding}) => {
    return (
        <span   
            className="button" 
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