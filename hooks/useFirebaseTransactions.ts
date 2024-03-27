import { useState, useEffect, use } from "react";
import { db } from "@/lib/firebase";
import { collection, updateDoc, onSnapshot, doc, getDocs, addDoc } from "firebase/firestore";
import type { UserTransaction, Transaction } from "@/types/transaction";

export default function useFirebaseTransactions(userId: string) {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	useEffect(() => {
		const unsub = onSnapshot(collection(db, "users", userId, "transactions"), (snapshot) => {
			const transactionsDocs = snapshot.docs.map((doc) => doc.data() as UserTransaction);
			setTransactions(snapshot.docs.map((doc) => {
				const data = doc.data() as UserTransaction;
				const totalAmount = calculateBanknoteAmount(data.banknotes);

				return ({
					...data,
					id: doc.id,
					customAmount: data.customAmount
						? data.customAmount
						: totalAmount,
					totalAmount,
					balance: calculateBalance([
						...transactionsDocs.filter(
							(t) => t.timestamp <= data.timestamp
						),
					])
				} as Transaction)
			}).sort((a, b) => a.timestamp - b.timestamp));

		});
		return unsub;
	}, []);



	const addTransaction = async (transaction: UserTransaction) => {
		try {
			const userRef = doc(db, "users", userId);
			await addDoc(collection(db, "users", userId, "transactions"), transaction);

			const updatedTransactions = [...transactions, transaction];
			const updatedBalance = calculateBalance(updatedTransactions);

			await updateDoc(userRef, {
				balance: updatedBalance,
			});
		} catch (error) {
			console.error("Error adding transaction:", error);
		}
	};

	const calculateBalance = (transactions: UserTransaction[]) => {
		return transactions.reduce((acc, transaction) => {
			if (transaction.customAmount) {
				return acc + transaction.customAmount;
			}
			return acc + calculateBanknoteAmount(transaction.banknotes);
		}, 0);
	};

	const calculateBanknoteAmount = (
		banknotes: UserTransaction["banknotes"]
	) => {
		return Object.entries(banknotes).reduce(
			(acc, [denomination, count]) => {
				return acc + Number(denomination) * count;
			},
			0
		);
	};

	return { addTransaction, transactions };
}
