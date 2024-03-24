"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type useFirebaseTransactions from "@/hooks/useFirebaseTransactions";
import { useMediaQuery } from "usehooks-ts";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import MoneyForm from "./MoneyForm";

const initButton = "Add transaction";
const title = "Add banknotes";
const description = "Specify the number of banknotes you want to add.";

export default function MoneyDialog() {
	const [open, setOpen] = useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant="outline">{initButton}</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>
					<MoneyForm />
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant="outline">{initButton}</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>{title}</DrawerTitle>
					<DrawerDescription>{description}</DrawerDescription>
				</DrawerHeader>
				<MoneyForm className="px-4" />
				{/* <DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
				</DrawerFooter> */}
			</DrawerContent>
		</Drawer>
	);
}
