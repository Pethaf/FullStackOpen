import Notification from "./Notification"
const NotifySuccess = ({message}) => {
    return <Notification className={"success"} message={message} />
}
export default NotifySuccess;