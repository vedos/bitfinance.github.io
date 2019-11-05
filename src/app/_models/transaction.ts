export class TransactionRequest {
    amount: number;
    description: string;
    budget: number;
    datetime?: Date;
    type?: string;
}

export class TransactionResponse {
    id: number;
    description: string;
    amount: number;
    datetime: Date;
    person: number;
    budget: number;
    typ: string;
}
