import { runQuestionTests } from "./TestQuestion";
import { runUserTests } from "./TestUser";

async function main() {
    console.log(" ****** TEST DE USER.TS ****** ");
    await runUserTests();

    console.log("\n\n ****** TEST DE QUESTIONS.TS ****** ");
    await runQuestionTests();
}

main();