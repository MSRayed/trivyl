import { SocketContext } from "@/app/socketContext";
import { CldImage } from "next-cloudinary";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { States } from "@/lib/utils";
import Clock from "@/components/main/Clock";
import Player from "@/managers/player";

interface QuestionBoardProps {
  state: States;
  setState: Dispatch<SetStateAction<States>>;
}

interface Question {
  query: string;
  id: string;
}

const QuestionBoard = ({ state, setState }: QuestionBoardProps) => {
  const socket = useContext(SocketContext);
  const [question, setQuestion] = useState<Question>();
  const [answer, setAnswer] = useState<string>();
  const [winner, setWinner] = useState<string>();

  useEffect(() => {
    socket.on("new-question", (question) => {
      setState(States.QUESTION);
      setQuestion(question);
    });

    socket.on("answer", (answer) => {
      setState(States.ANSWER);
      setAnswer(answer);
    });

    socket.on("results", (ranking: Player[]) => {
      setState(States.RESULTS);
      setWinner(ranking[0].name);
    });

    return () => {
      socket.off("game-started");
      socket.off("new-question");
      socket.off("answer");
    };
  }, []);

  return (
    <div
      className="
        w-[40vw] 
        bg-secondary
        rounded-md
        p-10
        min-h-[40vh]
        flex
        items-center
        justify-center
      "
    >
      {state == States.LOBBY && (
        <h1
          className="
              text-2xl
              text-wrap
              text-center
              text-muted-foreground
            "
        >
          Waiting for the owner to start the game
        </h1>
      )}
      {state == States.QUESTION && (
        <div>
          <div className="pb-5 flex justify-end">
            <Clock />
          </div>

          <h1
            className="
              text-xl
              text-wrap
              text-primary-foreground
              text-center
            "
          >
            {question?.query}
          </h1>

          {question && (
            <div className="p-10">
              <CldImage
                className="m-auto"
                width={200}
                height={200}
                src={question.id}
                alt={question.id}
              />
            </div>
          )}
        </div>
      )}
      {state == States.ANSWER && (
        <div>
          <p className="text-center">The answer is:</p>
          <h1 className="text-2xl font-extrabold text-primary text-center">
            {answer}
          </h1>
        </div>
      )}
      {state == States.RESULTS && <h1>{winner} won the game!</h1>}
    </div>
  );
};

export default QuestionBoard;
