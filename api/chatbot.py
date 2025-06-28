import streamlit as st
# Set page config as the first Streamlit command
st.set_page_config(page_title="RVCE Communication System Chatbot", page_icon="🤖", layout="wide")

import google.generativeai as genai
import os
import json
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson.objectid import ObjectId  # Add this import
from datetime import datetime
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# MongoDB setup
MONGO_URL = os.getenv("MONGO_URL")
uri = MONGO_URL
client = MongoClient(uri, server_api=ServerApi('1'))
database = client.get_database("remedialdb")
Q_A = database.get_collection("Q_a")

# Initialize session state

def init_session_state():
    if 'user_id' not in st.session_state:
        params = st.query_params
        user_id = params.get('userId', [None])[0]
        if user_id:
            st.session_state.user_id = user_id
            return True
        st.warning("Please login through the main application")
        return False
    return True

# Check session state
if not init_session_state():
    st.stop()

# Add this function to save Q&A
def save_qa_to_mongodb(question, answer):
    try:
        if not st.session_state.user_id:
            st.error("No user ID found. Please login first")
            return None

        qa_document = {
            "question": question,
            "chatbotAnswer": answer,
            "teacherApproved": False,
            "teacherModifiedAnswer": "",
            "status": "pending",
            "studentId": st.session_state.user_id,  # Using the ID directly
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        }
        
        result = Q_A.insert_one(qa_document)
        return str(result.inserted_id)
    except Exception as e:
        st.error(f"Error saving to MongoDB: {str(e)}")
        return None

# Gemini API setup
@st.cache_resource
def setup_gemini():
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    return genai.GenerativeModel('gemini-2.0-flash')

model = setup_gemini()

# Prompt template for RVCE chatbot
prompt_template = """
I'm a helpful chatbot designed to assist with your queries.

Teacher for TOC is Dr.Anala M R
Teacher for DBMS  is Dr. Padmashree T
Teacher for Aiml is Merin Meleet
Teacher for economics is Dr. Vanishree K
Teacher for Advance algorithms is Dr. Kavitha S N
TOC is the toughest subject in the current semester
Dr. G S Mamatha is Hod of ISE department
For 1st year students Classroom is IS-112B
For 2nd year students Classroom is IS-224
For 3rd year students Classroom is IS-221
For 4th year students Classroom is IS-106
CIE3 will begin from 27 January 2024
ISE department have two clubs-- coding club and women in cloud 
Previous year question papers can be accessed by this link-- http://172.16.44.10:8080/jspui/
Poornima Kulkarni, Dr. kavitha S N ,S G Raghavendra Prasad , Rekha B S are counsellors for Ise department
Harsh Gupta is president of Coding club rvce
Link for all notes are available in this link-- https://developer1010x.github.io/KnotesCentral/

Feel free to ask me any other questions.
"""

# Chatbot class
class RVCEChatbot:
    def __init__(self):
        self.chat_history = []

    def get_gemini_response(self, question):
        response = model.generate_content(question)
        return response.text

    def handle_user_input(self, user_input):
        # First, try to find an answer in the prompt template context
        context_check = self.get_gemini_response(f"""
        Check if the following question can be answered directly from this context:
        Context: {prompt_template}

        Question: {user_input}

        If the question can be directly answered from the context, respond with the answer.
        If not, respond with "NOT_FOUND_IN_CONTEXT".
        """)

        # If answer is found in context, return it
        if "NOT_FOUND_IN_CONTEXT" not in context_check:
            response = context_check
        else:
            # If not found in context, use Gemini to generate a general response
            response = self.get_gemini_response(user_input + " (Limit the response to 150 words.)")

        # Store conversation history
        self.chat_history.append({"role": "user", "content": user_input})
        self.chat_history.append({"role": "assistant", "content": response})
        return response

# Initialize chatbot
chatbot = RVCEChatbot()

# Streamlit UI
st.title("🤖 RVCE Communication System Chatbot")
st.write("Get answers to common queries about RVCE or ask your custom questions!")

# Sidebar for options
st.sidebar.title("Options")
option = st.sidebar.radio(
    "Choose a topic or ask your own question:",
    ["Common Questions", "Ask a Custom Question"]
)

# Main content area
if option == "Common Questions":
    st.subheader("Common Questions about RVCE")
    questions = [
        "Who teaches Theory of Computation?",
        "Which is the classroom for 3rd-year students?",
        "Which two clubs come under the ISE Department?",
        "Who are the faculty counselors?",
        "What is the toughest subject in the current semester?"
    ]
    selected_question = st.selectbox("Select a question:", questions)
    if st.button("Get Answer", key="common"):
        response = chatbot.handle_user_input(selected_question)
        st.write(f"**Answer:** {response}")

elif option == "Ask a Custom Question":
    st.subheader("Ask Your Own Question")
    user_question = st.text_input("Type your question here:")
    if user_question and st.button("Get Answer", key="custom"):
        response = chatbot.handle_user_input(user_question)
        st.write(f"**Answer:** {response}")
        if save_qa_to_mongodb(user_question, response):
            st.success("Question saved successfully!")
        else:
            st.error("Failed to save question")

# Display chat history
st.subheader("Chat History")
for message in chatbot.chat_history:
    if message["role"] == "user":
        st.write(f"👤 **You:** {message['content']}")
    else:
        st.write(f"🤖 **Chatbot:** {message['content']}")

# Footer
st.markdown("---")
st.markdown("Created with ❤️ for RVCE students and faculty. For additional resources, reach out to the ISE Department!")