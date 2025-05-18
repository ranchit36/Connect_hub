from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os
# Load environment variables
load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

uri = MONGO_URL
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

database_names = client.list_database_names()
print("Databases:", database_names)

database = client.get_database("test")
# List all collection names in the database
collection_names = database.list_collection_names()
print("Collections in 'test':", collection_names)

database = client.get_database("test")
Q_A = database.get_collection("Q_a")

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)