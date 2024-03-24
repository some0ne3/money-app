import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, updateDoc, getDoc, doc, getDocs, addDoc } from "firebase/firestore";
import type { User, UserTransaction, Transaction } from "@/types/transaction";

export default function useFirebaseTransactions(userId: string) {
	const [user, setUser] = useState<User | null>(null);
	useEffect(() => {
		getDoc(doc(db, "users", userId)).then((userSnapshot) => {
			setUser(userSnapshot.data() as User);
		});
	}, [userId]);

	const addTransaction = async (transaction: UserTransaction) => {
		try {
			const userRef = doc(db, "users", userId);
			const transactions = await getDocs(
				collection(db, "users", userId, "transactions")
			).then((querySnapshot) => {
				return querySnapshot.docs.map((doc) => doc.data() as UserTransaction);
			});

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
			if (transaction.type === "add") {
				if (transaction.customAmount) {
					return acc + transaction.customAmount;
				} else {
					return acc + calculateBanknoteAmount(transaction.banknotes);
				}
			} else {
				return acc - calculateBanknoteAmount(transaction.banknotes);
			}
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

	const getUserTransactions = async (): Promise<Transaction[]> => {
		if (!user) {
			return [];
		}

		const transactions = await getDocs(
			collection(db, "users", userId, "transactions")
		).then((querySnapshot) => {
			return querySnapshot.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
			} as { id: string } & UserTransaction));
		});
		const transactionData: Transaction[] = [];

		for (const transaction of transactions) {
			const totalAmount = transaction.customAmount
				? transaction.customAmount
				: calculateBanknoteAmount(transaction.banknotes);

			transactionData.push({
				description: transaction.description,
				timestamp: transaction.timestamp,
				type: transaction.type,
				banknotes: transaction.banknotes,
				customAmount: transaction.customAmount,
				totalAmount,
				id: transaction.id,
				balance: calculateBalance([
					...transactions.filter(
						(t) => t.timestamp <= transaction.timestamp
					),
				]),
			});
		}

		return transactionData;
	};

	return { user, addTransaction, getUserTransactions };
}
