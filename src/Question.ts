// Each questions are separated by 1 or more empty line
// Correct answers are prefixed with "Correct: "
// Constant definitions are prefixed with "Const: " and "{<const name>}"
// will be replaced with generated value.
// Eg: Const: rate from 0 to 10 step 0.1; $rate = {rate}$

const CORRECT_ANS_REGEX = /^Correct: (.*)$/;
const CONST_REGEX = /^Const: (\w+) from (\d+) to (\d+) step (\d+)$/;

export class Question {
    constructor(
        public readonly question: string,
        public readonly constants: Constant[],
        public readonly correctAnswers: string[],
        public readonly incorrectAnswers: string[]
    ) {}

    generate() {
        let constants: Record<string, number> = {};
        this.constants.forEach(c => {
            const blocks = (c.to - c.from) / c.step;
            const vb = Math.round(Math.random() * blocks);
            const v = vb * c.step;
            constants[c.name] = v;
        });

        function applyConsts(s: string) {
            Object.keys(constants).forEach(k => {
                s = s.replaceAll(`{${k}}`, constants[k].toString());
            });
            return s;
        }

        function pickRandom(a: string[]) {
            return a.splice(Math.floor(Math.random() * a.length), 1)[0];
        }

        function shuffle(a: string[]) {
            for (let i = 0; i < a.length * 5; i++) {
                const v = pickRandom(a);
                a.push(v);
            }
        }

        const correctAnswer = applyConsts(pickRandom([...this.correctAnswers]));
        const answers = [correctAnswer];
        const incorrectAnswers = [...this.incorrectAnswers];

        while (answers.length < 4 && incorrectAnswers.length > 0) answers.push(applyConsts(pickRandom(incorrectAnswers)));
        shuffle(answers);

        return <GeneratedQuestion> {
            question: applyConsts(this.question),
            answers,
            correctIndex: answers.indexOf(correctAnswer)
        };
    }

    static consume(stream: string[]) {
        let lastLine: string;
        do {
            lastLine = stream.shift();
            if (lastLine != null) lastLine = lastLine.trim();
        } while (lastLine != null && !lastLine.length);

        if (lastLine == null) return null;


        const question = lastLine;
        const constants: Constant[] = [];
        const correctAnswers: string[] = [];
        const incorrectAnswers: string[] = [];

        while (
            (lastLine = stream.shift()) != null &&
            (lastLine = lastLine.trim()).length > 0
        ) {
            let match: RegExpMatchArray;

            if (match = lastLine.match(CORRECT_ANS_REGEX)) {
                correctAnswers.push(match[1]);
            } else if (match = lastLine.match(CONST_REGEX)) {
                constants.push({
                    name: match[1],
                    from: +match[2],
                    to: +match[3],
                    step: +match[4]
                });
            } else {
                incorrectAnswers.push(lastLine);
            }
        }

        return new Question(question, constants, correctAnswers, incorrectAnswers);
    }

    static parseSet(set: string) {
        let lines = set.split("\n");
        let qs: Question[] = [];
        let q: Question;

        do {
            q = Question.consume(lines);
            if (q) qs.push(q);
        } while (q);

        return qs;
    }

    static generateQuestions(set: Question[], questions = set.length, repeatSameType = false) {
        if (!repeatSameType) set = [...set];
        let generated: GeneratedQuestion[] = [];

        for (let i = 0; i < questions; i++) {
            let picked = Math.floor(Math.random() * set.length);
            generated.push(set[picked].generate());
            if (!repeatSameType) set.splice(picked, 1);
        }

        return generated;
    }
}

export interface Constant {
    name: string;
    from: number;
    to: number;
    step: number;
}

export interface GeneratedQuestion {
    question: string;
    answers: string[];
    correctIndex: number;
}
