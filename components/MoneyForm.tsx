"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus } from "lucide-react";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import useFirebaseTransactions from "@/hooks/useFirebaseTransactions";

interface Banknotes {
	10: number;
	20: number;
	50: number;
	100: number;
	200: number;
	500: number;
}

export default function MoneyForm({ className }: React.ComponentProps<"form">) {
	const [banknotes, setBanknotes] = useState<Banknotes>({
		10: 0,
		20: 0,
		50: 0,
		100: 0,
		200: 0,
		500: 0,
	});
	const [sum, setSum] = useState(0);

	useEffect(() => {
		setSum(
			banknotes[10] * 10 +
				banknotes[20] * 20 +
				banknotes[50] * 50 +
				banknotes[100] * 100 +
				banknotes[200] * 200 +
				banknotes[500] * 500
		);
	}, [banknotes]);

	const handleAddBanknote = (value: keyof Banknotes) => {
		const updatedBanknotes = { ...banknotes };
		updatedBanknotes[value] += 1;
		setBanknotes(updatedBanknotes);
	};

	const handleRemoveBanknote = (value: keyof Banknotes) => {
		const updatedBanknotes = { ...banknotes };
		updatedBanknotes[value] -= 1;
		setBanknotes(updatedBanknotes);
	};

    const tx = useFirebaseTransactions("user");
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        tx.addTransaction({
            description: "todo: add description",
            timestamp: Date.now(),
            type: sum > 0 ? "add" : "subtract",
            banknotes: banknotes,
        });
    };

	return (
		<form onSubmit={handleSubmit} className={className}>
			<ScrollArea>
				{Object.entries(banknotes).map(([value, count]) => (
					<div key={value} className="p-4 pb-0">
						<div className="flex items-center justify-center space-x-2">
							<Button
								variant="outline"
								size="icon"
								className="h-10 w-10 shrink-0 rounded-full"
								onClick={(e) => {
									e.preventDefault();
									handleRemoveBanknote(
										Number(value) as keyof Banknotes
									);
								}}
							>
								<Minus className="h-6 w-6" />
								<span className="sr-only">Decrease</span>
							</Button>
							<div className="flex-1 text-center">
								<div className="text-7xl font-bold tracking-tighter">
									{count}
								</div>
								<div className="text-[0.70rem] uppercase text-muted-foreground">
									{`${value} PLN`}
								</div>
							</div>
							<Button
								variant="outline"
								size="icon"
								className="h-10 w-10 shrink-0 rounded-full"
								onClick={(e) => {
									e.preventDefault();
									handleAddBanknote(
										Number(value) as keyof Banknotes
									);
								}}
							>
								<Plus className="h-6 w-6" />
								<span className="sr-only">Increase</span>
							</Button>
						</div>
					</div>
				))}
			</ScrollArea>
			<DrawerFooter className="pt-8">
				<DrawerClose asChild>
                    <Button type="submit">
                        Continue with {sum > 0 && "+"}
                        {sum} PLN
                    </Button>
				</DrawerClose>
			</DrawerFooter>
		</form>
	);
}
