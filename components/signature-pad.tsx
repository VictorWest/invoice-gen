"use client"
import { useState } from "react"
import SignatureCanvas from "react-signature-canvas"
import Button from "./button"

type ChildProps = {
    handleSetUrl: (url: string) => void
}

export default function SignaturePad({ handleSetUrl }: ChildProps){
    const [ sign, setSign ] = useState<SignatureCanvas>()
    const [ isSaved, setIsSaved ] = useState(false)

    const handleClear = () => {
        sign?.clear()
        handleSetUrl("")
    }

    const handleSave = () => {
        handleSetUrl(sign?.getTrimmedCanvas().toDataURL('image/png') || "")
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 2000)
    }

    return(
        <div className="flex flex-col items-center gap-2">
            <div className="border border-stone-400 w-fit">
                <SignatureCanvas
                    ref={(data: SignatureCanvas) => setSign(data)}
                    canvasProps={{ width: 500, height: 200, className: 'sigCanvas'}}
                />
            </div>
            <div className="flex gap-2">
                <div onClick={handleClear}><Button bgColour="#e7e5e4" textColour="black" title="Clear" className="border border-stone-300" /></div>
                <div onClick={handleSave}><Button bgColour="black" textColour="white" title={isSaved ? "Saved!" : "Save"} /></div>
            </div>
        </div>
    )
}