import Notification from "./Notification";

const NotifyFailure = ({message}) => {
    return <Notification message = {message} className={"error"} />
}

export default NotifyFailure