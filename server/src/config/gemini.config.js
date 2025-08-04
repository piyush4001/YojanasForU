import "dotenv/config" // Ensures .env is loaded
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Generative AI client with the API key from environment variables.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

/**
 * Helper function to check if the message contains any basic demographic details.
 * This is a simple keyword-based check and can be made more sophisticated.
 * @param {string} message - The user's message.
 * @returns {boolean} True if details are likely present, false otherwise.
 */
const checkIfMessageContainsDetails = (message) => {
  const lowerCaseMessage = message.toLowerCase()
  // Keywords for age, caste, gender, income in English and Hindi
  const detailKeywords = [
    "age",
    "caste",
    "gender",
    "income",
    "years old",
    "male",
    "female",
    "salary",
    "उम्र",
    "जाति",
    "लिंग",
    "आय",
    "साल",
    "पुरुष",
    "महिला",
    "वेतन",
  ]
  return detailKeywords.some((keyword) => lowerCaseMessage.includes(keyword))
}

/**
 * Fetches a response from the Gemini model based on user message and selected language.
 *
 * @param {string} message - The user's message.
 * @param {string | null} language - The selected language ("Hindi" or "English"), or null if not yet selected.
 * @param {boolean} [forceSchemeSuggestion=false] - If true, the model will attempt to suggest schemes
 * even if details are missing (for follow-up messages).
 * If false, it will ask for details if none are present.
 * @returns {Promise<string>} A promise that resolves to the Gemini's text response.
 */
const getGeminiResponse = async (
  message,
  language,
  forceSchemeSuggestion = false
) => {
  // Use a model name from environment variables for flexibility.
  // Fallback to "gemini-pro" if GEMINI_MODEL_NAME is not set.
  const modelName = process.env.GEMINI_MODEL_NAME || "gemini-pro"
  const model = genAI.getGenerativeModel({ model: modelName })

  let prompt = ""

  if (!language) {
    // Prompt for language selection if no language is provided.
    prompt = `
The user has not selected a language yet.

Your only response should be: "Please choose a language: Hindi or English. कृपया एक भाषा चुनें: हिंदी या अंग्रेज़ी।"
Do not add any other text or conversational filler.
`
  } else {
    // Construct language-specific instruction for the model.
    const langInstruction =
      language === "Hindi"
        ? "Your entire response must be in Hindi. Do not include any English."
        : "Your entire response must be in English. Do not include any Hindi."

    const userHasDetails = checkIfMessageContainsDetails(message)

    if (forceSchemeSuggestion || userHasDetails) {
      // Scenario 1: Force scheme suggestion (for second message without details)
      // OR Scenario 2: User provided details (first or subsequent message)
      prompt = `
You are a helpful assistant for an Indian government scheme portal called YojansForU.
Your goal is to assist users in finding suitable government schemes.

User's message: "${message}"

${langInstruction}

- Based on the details provided in the user's message (or if no specific details are given, provide general relevant schemes), suggest one or more suitable government schemes.
- **Present each suggested scheme in a separate paragraph.**
- For each suggested scheme, provide its details in the following structured and easily readable format. Use clear headings and line breaks:

  **Scheme Title:** [Name of the scheme]
  **Eligibility:** [Eligibility criteria for the scheme]
  **Short Description:** [A brief explanation of the scheme's purpose and benefits]

- Ensure the overall response is beautifully structured for reading, with clear separation between different schemes.
- If no suitable scheme can be identified with the given information, politely state that you need more information to provide a specific scheme, but still offer general advice or common scheme categories if possible.
- Do not invent schemes or provide information unrelated to government schemes.
`
    } else {
      // Scenario 3: First message with no details. Ask for details.
      prompt = `
You are a helpful assistant for an Indian government scheme portal called YojansForU.
Your goal is to assist users in finding suitable government schemes.

User's message: "${message}"

${langInstruction}

- The user's message lacks important details (e.g., age, caste, gender, income) needed to suggest a suitable scheme.
- Politely and clearly ask for the specific missing information (age, caste, gender, income) in the selected language. Your response should focus only on requesting these details.
- Do not suggest any schemes at this point.
`
    }
  }

  try {
    // Attempt to generate content from the Gemini model.
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    // Log the error for debugging purposes.
    console.error("Error fetching response from Gemini API:", error)
    // Return a user-friendly error message.
    return "I'm sorry, I'm currently experiencing technical difficulties and can't process your request. Please try again in a moment."
  }
}

export default getGeminiResponse
