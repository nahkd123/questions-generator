import {GeneratedQuestion} from "./Question";

export class LaTeXGenerator {
    questions: string[] = [];
    head: string[] = [];

    add(q: GeneratedQuestion) {
        this.questions.push([
            `\\question ${q.question}`,
            `  \\begin{choices}`,
            ...q.answers.map((v, i) => `    \\${i == q.correctIndex? "CorrectChoice" : "choice"} ${v}`),
            `  \\end{choices}`
        ].join("\n"));
    }

    getLaTeX(isKeys = false) {
        return [
            `\\documentclass[a4paper,14pt${isKeys? ",answers" : ""}]{exam}`,
            ...this.head,
            `\\begin{document}`,
            `Generated exam | ${new Date()}`,
            `\\vspace{0.15in}`,
            ``,
            `\\begin{questions}`,
            ...this.questions,
            `\\end{questions}`,
            `\\end{document}`
        ].join("\n");
    }
}
