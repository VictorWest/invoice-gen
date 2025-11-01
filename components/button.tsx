import React from "react";
import Oval from "react-loading-icons/dist/esm/components/oval"

export default function Button({textColour, bgColour, title, className, isLoading} : {textColour?:string, bgColour:string, title:React.ReactNode, className?:string, isLoading?: boolean}){
    return(
        <div style={{ color: textColour || "black", background: bgColour }} className={`px-5 py-3 text-sm rounded-full cursor-pointer hover:opacity-80 flex items-center justify-center ${className}`}>
            {isLoading ? <Oval height={20} width={20} speed={.5} stroke="#fff" /> : title}
        </div>
    )
}