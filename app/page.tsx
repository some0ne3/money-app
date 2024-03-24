import MoneyDialog from "@/components/MoneyDialog";
import TransactionsTable from "@/components/TransactionsTable";
export default function Home() {

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
      <TransactionsTable />
			<MoneyDialog />
		</main>
	);
}
