import QuestionBank, { Question } from "@/app/managers/QuestionBank";

class QuestionManager {
  public questions: Question[];

  constructor() {
    this.questions = [];
  }

  initQuestions() {
    this.questions = QuestionBank.getRandomSet(10);
  }
}

export default QuestionManager;
