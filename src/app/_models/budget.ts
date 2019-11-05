export class BudgetRequest {
    name: string;
    amount: number;
    date_from?: Date;
    date_to?: Date;
}

export class BudgetResponse {
    id: number;
    name: string;
    amount: number;
    date_from: Date;
    date_to: Date;
    date_created: Date;
    owner: number[];
}


export class BudgetResponseExt extends BudgetResponse {
    budget_users: BudgetUser[];
}

export class BudgetUser {
    id:number;
    name: string;
}