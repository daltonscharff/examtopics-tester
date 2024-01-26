import fs from "fs-extra";
import { load } from "cheerio";
import path from "path";

const htmlFolderPath = "./html";
const jsonOutputFile = "../questions.json";

const htmlFileNames = fs.readdirSync(htmlFolderPath);
let questions = [];

for (const fileName of htmlFileNames) {
  const filePath = path.join(htmlFolderPath, fileName);
  questions = questions.concat(scrapeQuestionsFromFile(filePath));
}

fs.writeJSONSync(jsonOutputFile, questions);
console.log(questions.length, "questions written to", jsonOutputFile);

function scrapeQuestionsFromFile(filePath) {
  const fileContents = fs.readFileSync(filePath);
  const $ = load(fileContents);

  const questions = [];

  $(".card.exam-question-card")
    .toArray()
    .forEach((card) => {
      questions.push({
        question: $(card).find(".card-text").first().text().trim(),
        choices: $(card)
          .find(".multi-choice-item")
          .map((_, choice) => ({
            text: $(choice)
              .contents()
              .filter((i) => i > 1)
              .text()
              .trim(),
            letter: $(choice)
              .find(".multi-choice-letter")
              .attr("data-choice-letter"),
          }))
          .toArray(),
        answers: $(card)
          .find(".multi-choice-item.correct-hidden")
          .map((_, choice) =>
            $(choice).find(".multi-choice-letter").attr("data-choice-letter")
          )
          .toArray(),
      });
    });

  return questions;
}
