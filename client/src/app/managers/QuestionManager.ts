import QuestionBank, { Question } from "@/app/managers/QuestionBank";

class QuestionManager {
  public questions: Question[];

  constructor() {
    this.questions = [];
  }

  initQuestions() {
    this.questions = QuestionBank.getRandomSet(10);
  }

  getQueuedQuestion() {
    const question = this.questions[0];
    // Delete the question after sending it
    this.questions.splice(0, 1);
    return question;
  }
}

export default QuestionManager;
