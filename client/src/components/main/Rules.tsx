"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "@/app/socketContext";
import { States } from "@/lib/utils";

interface RulesProps {
  state: States;
  owner: boolean;
}

interface RulesType {
  numberOfQuestions: number;
  answerTime: number;
}

const Rules = ({ state, owner }: RulesProps) => {
  const questionNumRef = useRef<HTMLInputElement>(null);
  const answerTimeRef = useRef<HTMLInputElement>(null);
  const socket = useContext(SocketContext);
  const [rules, setRules] = useState<RulesType>();

  const saveRules = () => {
    socket.emit("change-rules", {
      numberOfQuestions: Number(questionNumRef.current?.value),
      answerTime: Number(answerTimeRef.current?.value),
    });
  };

  useEffect(() => {
    socket.on("set-rules", (rules: RulesType) => {
      setRules(rules);
    });

    return () => {
      socket.off("get-rules");
    };
  }, [questionNumRef.current, answerTimeRef.current]);

  return (
    <Sheet>
      <SheetTrigger
        className="p-10 disabled:text-muted disabled:font-bold"
        disabled={state != States.LOBBY}
      >
        {owner ? "Edit" : "Show"} Rules
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Rules</SheetTitle>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="questionNum" className="text-right">
              Questions
            </Label>
            <Input
              id="questionNum"
              ref={questionNumRef}
              type="number"
              className="col-span-3"
              defaultValue={rules?.numberOfQuestions}
              disabled={!owner}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="answerTime" className="text-right">
              Time (seconds)
            </Label>
            <Input
              id="answerTime"
              ref={answerTimeRef}
              type="number"
              className="col-span-3"
              defaultValue={rules?.answerTime}
              disabled={!owner}
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={saveRules}>Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Rules;
