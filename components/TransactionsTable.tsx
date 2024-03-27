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
	const { transactions } = useFirebaseTransactions("user");
	
    useEffect(() => {
        console.log("Fetching transactions...");
		console.log(transactions);
    }, [transactions]);


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
				{transactions.map((transaction, i) => (
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
									([denomination, count]) => {
										if (count === 0) return "";
										return `${denomination} x ${Math.abs(count)}`
									}
								).filter(str => str)
								.join(", ") || transaction.customAmount}
						</TableCell>
						<TableCell className="text-right">{
							(transaction.totalAmount > 0 ? "+" : "") +
							transaction.totalAmount}</TableCell>
						<TableCell className={`text-right ${i === transactions.length-1 ? "font-bold" : ""}`}>
							{transaction.balance}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
