from dotenv import load_dotenv
import os

load_dotenv()

TOP_K = int(os.getenv("TOP_K", 10))

EVENT_WEIGHTS = {
    "VIEW": 1,
    "CLICK": 2,
    "FAVORITE": 3,
    "ENROLL": 5
}