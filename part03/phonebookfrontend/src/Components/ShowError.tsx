import React from "react"
import { ShowMessage } from "./ShowMessage"
export const ShowError = ({message}) => {
    return <ShowMessage 
    divStyle=
        {{color: 'red',
        fontStyle: 'italic',
        fontSize: 16,
        border:"1px solid red",
        background:"lightgray"}}
    paragraphStyle=
    {{
            background:"lightgray",
            textAlign:"center"
    }}
    message={message}
   />
}