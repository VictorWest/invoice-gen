export function formatCurrency(number: number, currency: string = "$") {
    const isNegative = number < 0;

    const absoluteNumber = Math.abs(number);
    
    // Format the number as currency
    const formattedNumber = new Intl.NumberFormat('en-US', {
        // style: 'currency',
        // currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(absoluteNumber);
    
    return isNegative ? `-${currency}${formattedNumber}` : `${currency}${formattedNumber}`;
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function formatDateDayMonth(timestamp: string | Date){
    timestamp = timestamp.toLocaleString()

    const match = timestamp.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)

    if (match) {
        const [_, year, month, day] = match;
        return `${months[+month - 1]} ${day}, ${year}`
    } 
    return timestamp
}