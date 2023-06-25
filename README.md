# Questions generator
_Generate questions (and exams) from given set of "templates"_

Command-line interface _might_ be provided after I've finished all exams ;)

## Usage
### Write your own "templates"
```
Your question 1
Correct: Your correct answer 1
Corrent: Your correct answer 2
Your incorrect answer 1
Your incorrect answer 2
Your incorrect answer 3
Your incorrect answer 4

Your question 2 with constant {k}
Const: k from 1 to 100 step 0.1
Correct: Your correct answer 1 with constant {k}
Corrent: Your correct answer 2
Your incorrect answer 1 with constant {k}
Your incorrect answer 2 with constant {k}
Your incorrect answer 3
Your incorrect answer 4
```

### Use your templates
```typescript
import * as qg from "@nahkd123/questions-generator";
import * as fs from "node:fs";

let templates = qg.Question.parseSet(fs.readFileSync("template.txt", "utf-8"));
let generated = qg.Question.generateQuestions(templates);
```

### Create LaTeX (and maybe PDF) from generated questions
```typescript
let latex = new qg.LaTeXGenerator();
generated.forEach(v => latex.add(v));

console.log(latex.getLaTeX()); // node myscript.js | pdflatex

// Or you can get generated LaTeX for each question
// latex.questions.forEach(...);
```

---

Made with Termux (because I can't use PC right now lol).
