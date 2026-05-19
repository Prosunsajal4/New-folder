const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyBzu3laYO3NOYiSLKcS52ZfxmbBvjdbhuk";
const client = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
  try {
    console.log(`\nTesting ${modelName}...`);
    const model = client.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Hello, what is photosynthesis?");
    const text = result.response.text();
    console.log(`✅ SUCCESS with ${modelName}`);
    console.log("Response:", text.substring(0, 100));
  } catch (error) {
    console.log(`❌ FAILED with ${modelName}`);
    console.log("Error:", error.message.substring(0, 200));
  }
}

(async () => {
  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-pro"];
  
  for (const model of models) {
    await testModel(model);
  }
})();
