from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
import datetime

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize models
GROQ_API_KEY = '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'
chat = ChatGroq(
    temperature=0,
    model_name="mixtral-8x7b-32768",
    groq_api_key=GROQ_API_KEY)

# Initialize variables
user_name = "dron"
curr_time = datetime.datetime.now()

# Define the LLM function
def llm(role, put):
    prompt = ChatPromptTemplate.from_messages([
        ("system", role),
        ("human", put)
    ])
    variables = {
        "TASK": [],
        "REMINDER": [],
        "NOTE": []
    }  # Initialize variables with empty lists
    chain = prompt | chat
    result = chain.invoke(variables).content.strip()
    return result

# Extract task prompt
Ext_todo = f"""
        You are Azmth. A very intelligent, context-aware personal AI assistant to the human named: {user_name}.
        Here are the instructions you need to follow:
        1. The provided text is a natural language transcription at time {curr_time}. This is for your context awareness.
        2. Extract To-Do tasks, reminders, and notes from the input.
        3. Format the result as JSON, with separate categories for TASK, REMINDER, and NOTE.
        Example Input: "I have a meeting with John at 3pm today about the project status for half an hour.
                        Remind me to feed my dog at 1pm and to pick up my son from school at 3 pm and
                        attend the meeting with my boss at 7pm."
        Example Output: JSON only.
        If no input is provided, or if there's a problem, return 'None' for all categories.
        You are permitted to only return JSON or 'None'. Do not add anything else at any cost.
        If tasks are found, return JSON or in every other case, return None.
"""

# Route to handle requests from the frontend
@app.route('/endpoint', methods=['POST'])
def handle_request():
    try:
        data = request.json
        input_text = data.get('input_text', '')

        # Call the LLM function with the provided input
        response = llm(Ext_todo, input_text)
        # Log the response to the terminal
        print(f"Response sent to frontend: {response}")

        # Return the LLM response as JSON
        return jsonify({"response": response})

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": "An error occurred while processing your request."}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, port=5000)