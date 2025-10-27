import { forwardRef, InputHTMLAttributes } from "react"

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement>{ 
    type?: string, 
    label?: string, 
    placeholder: string, 
    className?: string ,
    inputIsInvalid?: boolean
}

const Input = forwardRef<HTMLInputElement, CustomInputProps>(({type, label, placeholder, className, inputIsInvalid, ...props}, ref) => {
    return(
        <div className="flex items-center gap-5 text-xs">
            {label && <p className="w-20">{label}</p>}
            <input 
                style={{ borderColor: inputIsInvalid ? "#FF2C2C" : "#a6a09b" }} 
                ref={ref}
                type={type || "text"}
                className={`px-2 py-3 bg-white rounded-md outline-0 border w-full ${className}`} 
                placeholder={placeholder || "Type something"} 
                {...props}
            />
        </div>
    )
})

Input.displayName = "Input"
export default Input