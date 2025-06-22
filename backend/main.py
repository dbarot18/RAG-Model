from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain_community.llms import Ollama

import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this for production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to hold current QA chain after PDF upload
qa_chain = None

class ExplainRequest(BaseModel):
    concept: str

@app.post("/summarize_pdf/")
async def summarize_pdf(file: UploadFile = File(...)):
    global qa_chain
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())

    try:
        loader = PyPDFLoader(file_location)
        documents = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        docs = text_splitter.split_documents(documents)

        embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        vectorstore = Chroma.from_documents(docs, embedding_model, persist_directory="rag_db")
        retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 10})

        llm = Ollama(model="llama3")
        qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

        combined_text = "\n".join([doc.page_content for doc in docs[:15]])
        prompt = (
            "Summarize the following technical content clearly and concisely:\n\n"
            f"{combined_text}\n\nSummary:"
        )

        response = llm.invoke(prompt)

        return {"summary": response}
    except Exception as e:
        return {"error": str(e)}
    finally:
        if os.path.exists(file_location):
            os.remove(file_location)

@app.post("/explain_concept/")
async def explain_concept(request: ExplainRequest):
    global qa_chain
    if qa_chain is None:
        return {"error": "Please upload and summarize a PDF first."}

    concept = request.concept
    prompt = f"Explain the concept of '{concept}' in simple terms with examples."

    try:
        response = qa_chain.run(prompt)
        return {"explanation": response}
    except Exception as e:
        return {"error": str(e)}
