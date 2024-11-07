import questionsData from "@/data/famousPeople.json";

export interface Question {
  query: string;
  id: string;
  answer: string;
}

export interface IDData {
  [name: string]: String;
}

class QuestionBank {
  static getRandomSet(n: number) {
    const set = [];
    const keys = Object.keys(questionsData.data);

    for (let i = 0; i < n; i++) {
      const key = keys[Math.floor(Math.random() * keys.length)];
      const id = (questionsData.data as IDData)[key as string];

      set.push({
        query: questionsData.query,
        id: id,
        answer: key,
      } as Question);
    }

    return set;
  }
}

export default QuestionBank;
