interface QuestionBoardProps {
  started: boolean;
}

const QuestionBoard = ({ started }: QuestionBoardProps) => {
  return (
    <div
      className="
      h-[50vh] 
      w-[50vw] 
      bg-secondary
      rounded-md
      p-10
      "
    >
      {!started && (
        <div className="h-full flex justify-center items-center">
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
      )}
    </div>
  );
};

export default QuestionBoard;
