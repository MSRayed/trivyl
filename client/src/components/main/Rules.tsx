"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const Rules = () => {
  return (
    <Sheet>
      <SheetTrigger className="p-10">Edit Rules</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Rules</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default Rules;
