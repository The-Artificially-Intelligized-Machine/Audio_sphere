from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing to allow requests from the frontend

@app.route('/endpoint', methods=['POST'])
def endpoint():
    # Sample JSON response with markdown content, including a table and code block
    sample_data = {
        "content": """
# Sample Response

This is a test to check *markdown* rendering with tables and code snippets.

## Table Example

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1    | Data 1   | More 1   |
| Row 2    | Data 2   | More 2   |
| Row 3    | Data 3   | More 3   |

## Code Block Example
```
python
def hello_world():
    print("Hello, World!")
```
You can test this by sending input to the server! """ } 
    return jsonify(sample_data) # Send the sample markdown content as a JSON response

if __name__ == '__main__': 
    app.run(debug=True, port=5000) # Run the server on port 5000