import {readFileSync} from "fs";
import {LaTeXGenerator} from "./LaTeXGenerator";
import {Question} from "./Question";

let set = Question.parseSet(readFileSync("sample-set.txt", "utf-8"));
let latex = new LaTeXGenerator();
latex.head.push("\\usepackage[margin=1in]{geometry}");
Question.generateQuestions(set).forEach(v => latex.add(v));

process.stdout.write("% node dist/test.js | pdflatex\n");
process.stdout.write(latex.getLaTeX(true) + "\n");
