# FLORA: Intelligent Plant Recognition & Disease Diagnosis System

## Project Overview
FLORA is an AI-powered system designed to assist users in identifying plants, detecting diseases, and receiving treatment recommendations. The system integrates Computer Vision models with a Natural Language Processing chatbot powered by Ollama, all connected through a Node.js backend.

---

## Features
* **Plant recognition** using image input.
* **Disease detection** and diagnosis.
* **AI chatbot** using Ollama for interactive support.
* **Treatment suggestions** and detailed guidance.
* **Web-based interface** for easy accessibility.
* **Fast and scalable** Node.js backend.

---

## Tech Stack
* **AI Models:** Python, TensorFlow / PyTorch (CNN).
* **Chatbot:** Ollama (Local LLM).
* **Backend:** Node.js (Express).
* **Frontend:** HTML, CSS, JavaScript.
* **Dataset:** PlantVillage.

---

## System Workflow
1. **Image Upload:** The user uploads a photo of a plant via the web interface.
2. **Analysis:** The Node.js backend sends the image to the CNN-based Machine Learning model.
3. **Identification:** The ML model identifies the plant and detects the specific disease.
4. **Context Handoff:** The model sends the identified disease name to the **Ollama chatbot**.
5. **Interactive Support:** Ollama processes the diagnosis and initiates a conversation with the user, providing treatment advice and answering follow-up questions.

---
## Use Case Diagram

![Use Case Diagram](uses_case.jpg)

---

## Activity Diagram
```mermaid
stateDiagram-v2
    [*] --> UploadImage : User selects & uploads photo
    UploadImage --> Processing : Backend receives image
    Processing --> ML_Analysis : Image passed to CNN Model
    ML_Analysis --> ResultExtraction : Model identifies Disease
    ResultExtraction --> Ollama_Context : Disease Name sent to Chatbot
    Ollama_Context --> GenerateResponse : Ollama formulates treatment advice
    GenerateResponse --> DisplayUI : Results & Chat window shown to User
    DisplayUI --> UserChat : User asks follow-up questions
    UserChat --> GenerateResponse
    DisplayUI --> [*] : User ends session
```

---

## Class Diagram
```mermaid
classDiagram
    class User {
        +String userId
        +String sessionID
        +uploadPhoto(Image)
        +askQuestion(String)
    }

    class FloraBackend {
        <<Service>>
        +processRequest()
        +routeToML(Image)
        +routeToOllama(Diagnosis)
        +sendResponseToUser()
    }

    class MLModel {
        <<Python/CNN>>
        +String modelPath
        +preprocess(Image)
        +predict(Image) Diagnosis
    }

    class Diagnosis {
        +String plantName
        +String diseaseName
        +float confidenceScore
        +String timestamp
    }

    class OllamaChatbot {
        <<Local LLM>>
        +String modelName
        +generateTreatmentAdvice(Diagnosis)
        +handleFollowUp(String) String
    }

    class Database {
        <<Storage>>
        +saveRecord(Diagnosis)
        +getHistory(userId)
    }

    User --> FloraBackend : Interactions
    FloraBackend --> MLModel : Sends Image
    MLModel --> Diagnosis : Produces
    Diagnosis ..> OllamaChatbot : Injected as Context
    FloraBackend --> OllamaChatbot : Requests Response
    FloraBackend --> Database : Persists Data
    OllamaChatbot --> User : Provides Chat/Advice
```
## Sequence Diagram
```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant BE as Node.js Backend
    participant ML as ML Model (cNN)
    participant OL as Ollama ( aya)

    User->>FE: Upload plant image
    FE->>BE: POST /api/predict (multipart)
    BE->>ML: Forward image for inference
    ML-->>BE: Disease name + confidence score
    BE->>OL: Send disease context prompt
    OL-->>BE: Treatment advice response
    BE-->>FE: Combined JSON response
    FE-->>User: Display results + chat
    User->>FE: Ask follow-up question
    FE->>BE: POST /api/chat
    BE->>OL: Forward message + context
    OL-->>BE: Chat reply
    BE-->>FE: JSON reply
    FE-->>User: Display chatbot response
```
## Component Diagram
```mermaid
graph TB
    subgraph Frontend["Frontend (HTML/CSS/JS)"]
        UI[Upload UI]
        CB[Chatbot UI]
    end

    subgraph Backend["Node.js Backend (Express :3000)"]
        RT[Express Router]
        MU[Multer Upload]
        ML_P[ML Proxy]
        OL_C[Ollama Client]
    end

    subgraph AI["AI Services"]
        FL["cNN Inference Server\n(TensorFlow/PyTorch :5000)"]
        OL["Ollama Runtime\n(aya  :11434)"]
    end

    subgraph Data["Data & Models"]
        
        MW[(CNN Weights .h5)]
        CI[(class_indices.json)]
    end

    Frontend -->|REST HTTP| Backend
    ML_P -->|HTTP POST| FL
    OL_C -->|HTTP POST| OL
    Backend -->|loads| Data
    FL -->|reads| MW
    FL -->|reads| CI
```
## Deployment Diagram
```mermaid
graph TB
    subgraph Device["«device» User Browser"]
        WEB[index.html / app.js]
    end

    subgraph Server["«node» Local Machine / Server"]
        subgraph P1["«process» node app.js — port 3000"]
            EX[Express + Multer + Axios]
        end
        subgraph P2["«process» inference_server.py — port 5000"]
            FL[Cnn + TensorFlow + Pillow]
        end
        subgraph P3["«process» ollama run aya — port 11434"]
            LL[aya  Model]
        end
        FS[("«filesystem»\nmodels/ · dataset/ · uploads/ · .env")]
    end

    WEB -->|HTTP :3000| EX
    EX -->|HTTP :5000| FL
    EX -->|HTTP :11434| LL
    FL -->|reads| FS
    EX -->|temp writes| FS
```
---

## Team
* **Ahmed Waleed** – Machine Learning
* **Mohamed Sayed** – Data Science
* **Shehab Eissa** – Frontend Development
* **Seif Eldeen Hamouda** – Chatbot (NLP)
* **Seif Osama** – Chatbot (NLP)
* **Youssef Mahdy** – Backend Development (Node.js)

---

## Important Notes
* This project utilizes **Ollama** instead of Rasa for the chatbot implementation.
* The backend is built using **Node.js (Express)** to ensure high performance and scalability, replacing the initial Django proposal.
