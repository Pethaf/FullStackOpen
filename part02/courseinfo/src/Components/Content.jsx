import { Part } from "./Part";
const Content = ({parts}) => {
    return <>
    {parts.map(part => {
        return <Part {...part} key={part.id}></Part>
    })}
    
    </>
}

export {Content}