from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain_community.llms import Ollama

from typing import Optional
import shutil
import time
import uuid
import os
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global cache for QA chains if needed
session_chains = {}

# ---------------------------- Models ----------------------------

class ExplainRequest(BaseModel):
    concept: str
    session_id: str

class QuizRequest(BaseModel):
    prompt: Optional[str] = None
    session_id: str

# ---------------------------- Endpoints ----------------------------

@app.post("/summarize_pdf/")
async def summarize_pdf(file: UploadFile = File(...)):
    # Save uploaded file to disk
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())

    try:
        # Load and split PDF
        loader = PyPDFLoader(file_location)
        documents = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        docs = text_splitter.split_documents(documents)

        # Generate unique session ID
        session_id = f"session_{int(time.time())}_{uuid.uuid4().hex[:8]}"
        persist_path = os.path.join("sessions", session_id)
        os.makedirs(persist_path, exist_ok=True)

        # Build vectorstore
        embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        vectorstore = Chroma.from_documents(docs, embedding_model, persist_directory=persist_path)
        retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 10})
        llm = Ollama(model="llama3")
        qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

        # Cache chain for reuse if needed
        session_chains[session_id] = qa_chain

        # Summarize first N chunks
        combined_text = "\n".join([doc.page_content for doc in docs[:15]])
        prompt = (
            "Summarize the following technical content clearly and concisely:\n\n"
            f"{combined_text}\n\nSummary:"
        )
        response = llm.invoke(prompt)

        return {
            "summary": response,
            "session_id": session_id
        }

    except Exception as e:
        return {"error": str(e)}

    finally:
        if os.path.exists(file_location):
            os.remove(file_location)

# ---------------------------------------------------

@app.post("/explain_concept/")
async def explain_concept(request: ExplainRequest):
    try:
        persist_path = os.path.join("sessions", request.session_id)
        if not os.path.exists(persist_path):
            return {"error": "Session not found. Please upload a PDF first."}

        embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        vectorstore = Chroma(persist_directory=persist_path, embedding_function=embedding_model)
        retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 10})
        llm = Ollama(model="llama3")
        qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

        concept = request.concept
        prompt = f"Explain the concept of '{concept}' in simple terms with examples."
        response = qa_chain.run(prompt)

        return {"explanation": response}
    except Exception as e:
        return {"error": str(e)}

# ---------------------------------------------------

@app.post("/generate_quiz/")
async def generate_quiz(body: QuizRequest):
    try:
        persist_path = os.path.join("sessions", body.session_id)
        if not os.path.exists(persist_path):
            return {"error": "Please upload a PDF first to load context."}

        # Load vector DB
        embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        vectorstore = Chroma(persist_directory=persist_path, embedding_function=embedding_model)
        retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 10})
        llm = Ollama(model="llama3")
        qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

        # Retrieve content
        docs = vectorstore.similarity_search("overview", k=15)
        combined_text = "\n".join([doc.page_content for doc in docs])

        # Default to 10 questions
        question_count = 10
        if body.prompt:
            match = re.search(r"(\d+)\s*(?:questions|quiz)", body.prompt.lower())
            if match:
                question_count = int(match.group(1))

        prompt = (
            f"Create a {question_count}-question multiple-choice quiz based on the following content. "
            "Each question should have 4 options (A–D), and mark the correct one with '(Correct)':\n\n"
            f"{combined_text}\n\nQuiz:"
        )

        print("🧠 Generating quiz...")
        response = llm.invoke(prompt)

        # If not enough questions generated
        if response.count("A)") < question_count:
            return {
                "quiz": f"⚠️ Only partial quiz generated. Here is what we could extract:\n\n{response}"
            }

        return {"quiz": response}

    except Exception as e:
        print("❌ Error generating quiz:", str(e))
        return {"error": str(e)}
