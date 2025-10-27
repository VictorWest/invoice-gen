import React from "react";

export default function Button({textColour, bgColour, title, className} : {textColour?:string, bgColour:string, title:React.ReactNode, className?:string}){
    return(
        <div style={{ color: textColour || "black", background: bgColour }} className={`px-5 py-3 text-sm rounded-full cursor-pointer hover:opacity-90 ${className}`}>
            {title}
        </div>
    )
}