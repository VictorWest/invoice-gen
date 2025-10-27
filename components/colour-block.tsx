export default function ColourBlock({ colour="white", onClick }: { colour?: string, onClick: (colour: string) => void }){
    return <div onClick={() => onClick(colour)} style={{ backgroundColor: colour }} className={`w-8 h-8 rounded-md cursor-pointer ${colour == "white" && "border border-stone-400"}`}></div>
}