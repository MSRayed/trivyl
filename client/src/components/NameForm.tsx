import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { FormEvent, RefObject, useRef } from "react";
import { useCookies } from "next-client-cookies";

interface NameFormProps {
  onClick?: (event: FormEvent, ref: RefObject<HTMLInputElement>) => void;
  submitText: string;
}

const NameForm = ({ onClick, submitText }: NameFormProps) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const cookies = useCookies();

  const validName = () => {
    const name = nameRef.current?.value;

    if (!name) {
      alert("You need to enter a name");
      return false;
    }
    return true;
  };

  const onSubmit = (event: FormEvent) => {
    if (!validName()) {
      return;
    }

    const name = nameRef.current?.value;

    cookies.set("name", name as string);

    if (onClick) onClick(event, nameRef);
  };

  return (
    <form onSubmit={onSubmit} className="w-[40%] m-auto space-y-2">
      <Input
        defaultValue={cookies.get("name")}
        placeholder="Enter your name"
        ref={nameRef}
      />{" "}
      <Button type="submit" className="w-full">
        {submitText}
      </Button>
    </form>
  );
};

export default NameForm;
