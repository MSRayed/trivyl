import { Question } from "@/app/managers/QuestionBank";
import { SocketContext } from "@/app/socket";
import { CldImage } from "next-cloudinary";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface QuestionBoardProps {
  started: boolean;
  setStarted: Dispatch<SetStateAction<boolean>>;
}

const QuestionBoard = ({ started, setStarted }: QuestionBoardProps) => {
  const socket = useContext(SocketContext);
  const [question, setQuestion] = useState<Question>();

  useEffect(() => {
    socket.on("game-started", () => {
      console.log("Game started");

      setStarted(true);

      // Signal server to send question
      socket.emit("ready");
    });

    socket.on("new-question", (question) => {
      setQuestion(question);
    });

    return () => {
      socket.off("game-started");
      socket.off("new-question");
    };
  }, []);

  return (
    <div
      className="
      w-[40vw] 
      bg-secondary
      rounded-md
      p-10
      "
    >
      {!started ? (
        <div className="flex justify-center items-center">
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
        </div>
      ) : (
        <div>
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
    </div>
  );
};

export default QuestionBoard;
