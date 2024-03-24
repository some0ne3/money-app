export interface UserTransaction {
    description: string;
	timestamp: number;
	type: "add" | "subtract";
	banknotes: {
		10: number;
		20: number;
		50: number;
		100: number;
		200: number;
		500: number;
	};
	customAmount?: number;
}

export interface Transaction extends UserTransaction {
    id: string;
    totalAmount: number;
    balance: number;
}

export interface User {
	balance: number;
	transactions: UserTransaction[];
}
