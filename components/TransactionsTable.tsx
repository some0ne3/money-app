"use client";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Transaction } from "@/types/transaction";
import useFirebaseTransactions from "@/hooks/useFirebaseTransactions";
import { useEffect, useState } from "react";

export default function TransactionsTable() {
	const { getUserTransactions } = useFirebaseTransactions("user");
    const [transactions, setTransactions] = useState<Transaction[]>([]);
	
    useEffect(() => {
        console.log("Fetching transactions...");
        getUserTransactions().then((transactions) => {
            setTransactions(transactions.sort((a, b) => a.timestamp - b.timestamp));
        });
    }, []);


	return (
		<Table>
			<TableCaption>A list of your transactions.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Date</TableHead>
					<TableHead>Description</TableHead>
					<TableHead>Nominates</TableHead>
					<TableHead className="text-right">Amount</TableHead>
					<TableHead className="text-right">Balance</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{transactions.map((transaction: Transaction) => (
					<TableRow key={transaction.id}>
						<TableCell>
							{new Date(transaction.timestamp).toLocaleString()}
						</TableCell>
						<TableCell className="font-medium">
							{transaction.description}
						</TableCell>
						<TableCell>
							{Object.entries(transaction.banknotes)
								.map(
									([denomination, count]) =>
										`${denomination} x ${count}`
								)
								.join(", ") || transaction.customAmount}
						</TableCell>
						<TableCell className="text-right">{transaction.totalAmount}</TableCell>
						<TableCell className="text-right">
							{transaction.balance}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell colSpan={4}>Total</TableCell>
					<TableCell className="text-right">{transactions[transactions.length-1]?.balance} PLN</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	);
}
