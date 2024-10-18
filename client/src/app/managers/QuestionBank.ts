import questionsData from "@/app/data/famousPeople.json";

export interface Question {
  query: string;
  img: string;
  answer: string;
}

class QuestionBank {
  static getRandomSet(n: number) {
    const set = [];

    for (let i = 0; i < n; i++) {
      const question =
        questionsData.questions[
          Math.floor(Math.random() * questionsData.questions.length)
        ];
      set.push({
        query: questionsData.query,
        img: question.img,
        answer: question.answer,
      });
    }

    return set;
  }
}

export default QuestionBank;
