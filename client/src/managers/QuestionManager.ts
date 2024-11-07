import QuestionBank, { Question } from "@/managers/QuestionBank";

class QuestionManager {
  public questions: Question[];
  public usedQuestions: Question[];

  constructor() {
    this.questions = [];
    this.usedQuestions = [];
  }

  initQuestions() {
    this.questions = QuestionBank.getRandomSet(3);
  }

  getQueuedQuestion() {
    if (this.questions) {
      const question = this.questions[0];
      // Delete the question after sending it
      this.questions.splice(0, 1);
      this.usedQuestions.push(question);
      return question;
    } else {
      return null;
    }
  }

  getCurrentQuestion() {
    if (this.questions) {
      return this.usedQuestions[this.usedQuestions.length - 1];
    } else {
      null;
    }
  }
}

export default QuestionManager;
