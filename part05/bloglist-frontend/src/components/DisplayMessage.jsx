import "./DisplayMessage.css"
const DisplayMessage =({nameOfClass,message}) => {
    return <div className={`${nameOfClass} message-container`}>
        <p>{message}</p>
    </div>
}

export default DisplayMessage