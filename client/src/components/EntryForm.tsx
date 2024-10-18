"use client";

import { useRouter } from "next/navigation";
import { generateRoomCode } from "@/lib/utils";
import NameForm from "@/components/NameForm";
import { FormEvent } from "react";

const EntryForm = () => {
  const router = useRouter();

  const onCreate = async (event: FormEvent) => {
    event.preventDefault();

    const roomCode = generateRoomCode();

    router.push(`/${roomCode}`);
  };

  return (
    <div>
      <NameForm onClick={onCreate} submitText="Create Room" />
    </div>
  );
};

export default EntryForm;
