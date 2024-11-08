import { SocketContext } from "@/app/socketContext";
import { Input } from "@/components/ui/input";
import { FormEvent, useContext, useRef } from "react";

const AnswerInput = () => {
  const socket = useContext(SocketContext);
  const answerRef = useRef<HTMLInputElement>(null);

  const makeGuess = (event: FormEvent) => {
    event.preventDefault();

    if (answerRef.current?.value) {
      socket.emit(
        "guess",
        answerRef.current?.value as string,
        (response: any) => {
          if (answerRef.current) {
            if (response.correct) {
              answerRef.current.disabled = true;
            } else {
              answerRef.current.value = "";
            }
          }
        }
      );
    }
  };

  return (
    <form onSubmit={makeGuess}>
      <Input
        ref={answerRef}
        className="w-full mt-4 border-primary"
        placeholder="Enter your guess.."
        autoFocus
      />
    </form>
  );
};

export default AnswerInput;
