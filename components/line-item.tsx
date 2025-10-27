import Input from "./input"

export default function LineItem({ }){
    return(
        <div className="flex items-center gap-20 py-2 px-10">
            <div className="flex-1">
               <Input placeholder="Item Description" /> 
            </div>
            
            <div className="flex gap-5 *:w-20 *:text-end">
                <Input type="number" placeholder="0.0" />
                <Input type="number" placeholder="0.0" />
                <div>total</div>
                <div>Tax</div>
            </div>
        </div>
    )
}