import Category from "../model/Category";
import Question from "../model/Questions";

/**
 * Run tests for the Question class.
 */
export async function runQuestionTests(): Promise<void> {
    console.log('===== Début des tests =====');

    try {
        const question = new Question(
            1,
            Category.Calculs,
            "What is 2 + 2?",
            "4",
            "math.png",
            "The correct answer is the sum of 2 and 2, which is 4.",
            "multiple choice"
        );

        console.log('✅ Test createUser passé :', question);

        
        if (question.id !== 1) throw new Error("❌ Erreur lors de l'obtention du ID");
        console.log("✅ Test getId passé : " + question.id);

        if (question.category !== Category.Calculs) throw new Error("❌ category getter failed");
        console.log("✅ Test getCategory passé : " + question.category);

        if (question.question !== "What is 2 + 2?") throw new Error("❌ question getter failed");
        console.log("✅ Test getQuestion passé : " + question.question);


        if (question.answer !== "4") throw new Error("❌ answer getter failed");
        console.log("✅ Test getAnswer passé : " + question.answer);


        if (question.img !== "math.png") throw new Error("❌ img getter failed");
        console.log("✅ Test getImg passé : " + question.img);

        if (question.correction !== "The correct answer is the sum of 2 and 2, which is 4.")
            throw new Error("❌ correction getter failed");
        console.log("✅ Test getCorrection passé : " + question.correction);

        if (question.typeReponse !== "multiple choice") throw new Error("❌ typeReponse getter failed");
        console.log("✅ Test getTypeReponse passé : " + question.typeReponse);
    } catch (error) {
        console.error(error);
    }

    console.log('===== Fin des tests =====');
}