import DisplayMessage from "./DisplayMessage";

const DisplayFailure = ({ message }) => {
  return (
    <DisplayMessage nameOfClass={"error"} message={message}></DisplayMessage>
  );
};

export default DisplayFailure