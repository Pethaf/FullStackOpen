import React from "react"
import { ShowMessage } from "./ShowMessage"
export const ShowSuccess = ({message}) => {
    return <ShowMessage 
    divStyle=
        {{color: 'green',
        fontStyle: 'italic',
        fontSize: 16,
        border:"1px solid green",
        background:"lightgray"}}
    paragraphStyle=
    {{
            background:"lightgray",
            textAlign:"center"
    }}
    message={message}
   />
}