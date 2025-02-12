import DisplayMessage from "./DisplayMessage";

const DisplaySuccess = ({ message }) => {
    return <DisplayMessage message={message || "Default Message"} nameOfClass="success" />;
};

export default DisplaySuccess;
