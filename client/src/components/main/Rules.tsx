"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Rules {
  owner: boolean;
}

const Rules = ({ owner }: Rules) => {
  return (
    <Sheet>
      <SheetTrigger className="p-10">
        {owner ? "Edit" : "Show"} Rules
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Rules</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default Rules;
