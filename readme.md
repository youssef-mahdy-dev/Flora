# FLORA: Intelligent Plant Recognition & Disease Diagnosis System

## Project Overview
FLORA is an AI-powered system designed to assist users in identifying plants, detecting diseases, and receiving treatment recommendations. The system integrates Computer Vision models with a Natural Language Processing chatbot powered by Ollama, all connected through a Node.js backend.

## Features
* **Plant recognition** using image input.
* **Disease detection** and diagnosis.
* **AI chatbot** using Ollama for interactive support.
* **Treatment suggestions** and detailed guidance.
* **Web-based interface** for easy accessibility.
* **Fast and scalable** Node.js backend.

## Tech Stack
* **AI Models:** Python, TensorFlow / PyTorch (CNN).
* **Chatbot:** Ollama (Local LLM).
* **Backend:** Node.js (Express).
* **Frontend:** HTML, CSS, JavaScript.
* **Dataset:** PlantVillage.

## System Workflow
1. User uploads an image of a plant.
2. The backend sends the image to the ML model.
3. The model predicts plant type and disease.
4. The chatbot handles user questions using Ollama.
5. Results and recommendations are displayed to the user.

## 👥 Team
* **Ahmed Waleed** – Machine Learning
* **Mohamed Sayed** – Data Science
* **Shehab Eissa** – Frontend Development
* **Seif Eldeen Hamouda** – Chatbot (NLP)
* **Seif Osama** – Chatbot (NLP)
* **Youssef Mahdy** – Backend Development (Node.js)

## ⚠️ Important Notes
* This project utilizes **Ollama** instead of Rasa for the chatbot implementation.
* The backend is built using **Node.js (Express)** to ensure high performance and scalability, replacing the initial Django proposal.

## 📊 Use Case Diagram
```mermaid
graph TD
    User((User)) -->|Upload Image| System[FLORA System]
    User -->|Ask Questions| Chatbot
    System --> ML[ML Model: Plant/Disease]
    System --> Chatbot[Chatbot: Ollama LLM]
    ML -->|Prediction| User
    Chatbot -->|Response| User