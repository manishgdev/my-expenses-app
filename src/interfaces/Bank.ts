export interface Bank {
    id? : string,
    name : string,
    lastDigits : string,
    balance: number,
    isExpenseAccount: boolean,
    isActive : boolean
}