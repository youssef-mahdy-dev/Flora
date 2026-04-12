// --- Navigation Logic (SPA) ---
function showSection(section) {
    const landing = document.getElementById("landingView");
    const app = document.getElementById("appView");
    if (section === "app") {
        landing.style.display = "none";
        app.style.display = "block";
    } else {
        landing.style.display = "block";
        app.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("accessToken");
    
    // تأكد إن المسار ده صح لصفحة تسجيل الدخول
    if (!token && window.location.pathname.includes("app")) {
        window.location.href = "login.html"; 
        return;
    }

    const userInput = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");
    const chatMessages = document.getElementById("chatMessages");
    const fileInput = document.getElementById("fileInput");
    const analyzeBtn = document.getElementById("analyzeBtn");
    const imagePreviewContainer = document.getElementById("imagePreviewContainer");
    const imagePreview = document.getElementById("imagePreview");
    const sidebar = document.getElementById("sidebar");
    const clearChatBtn = document.getElementById("clearChatBtn");

    function appendMessage(text, type) {
        const div = document.createElement("div");
        div.className = type === "user" ? "user-msg" : "bot-msg";
        div.innerText = text;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // --- 1. إرسال الشات النصي ---
    sendBtn.onclick = async () => {
        const msg = userInput.value.trim();
        if (!msg) return;

        appendMessage(msg, "user");
        userInput.value = "";

        // ملاحظة: لو الباك إند محتاج صورة إجباري، الطلب ده هيفشل لحد ما تظبط الـ Route
        appendMessage("Processing your message...", "bot");
    };

    // --- 2. رفع وتحليل الصورة (الأهم) ---
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            imagePreview.src = URL.createObjectURL(file);
            imagePreviewContainer.style.display = "block";
            analyzeBtn.style.display = "block";
            sendBtn.style.display = "none";
        }
    };

    document.getElementById("cancelUpload").onclick = () => {
        imagePreviewContainer.style.display = "none";
        analyzeBtn.style.display = "none";
        sendBtn.style.display = "block";
        fileInput.value = "";
    };

    analyzeBtn.onclick = async () => {
        const file = fileInput.files[0];
        if (!file) return;

        analyzeBtn.innerText = "Analyzing...";
        const currentToken = localStorage.getItem("accessToken");

        const formData = new FormData();
        formData.append("plantImage", file); 

        try {
            const response = await fetch("http://localhost:3000/api/v1/plant/diagnose", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${currentToken}`
                },
                body: formData 
            });

            const result = await response.json();

            if (response.ok) {
                console.log("Validation Details:", result.details); // ده هيقولك الـ field اللي ناقص اسمه إيه
    appendMessage("Error: " + (result.message || "Validation Error"), "bot");
                // استلام البيانات من الباك إند (تأكد من الـ Path في الـ JSON بتاعك)
                const diagnosisData = result.data.diagnosis; 

                document.getElementById("analysisResult").style.display = "block";
                document.getElementById("resText").innerHTML = `Detected: <b>${diagnosisData.diagnosis.diseaseName}</b>`;
                document.getElementById("resTreatment").innerText = `Confidence: ${Math.round(diagnosisData.diagnosis.confidence * 100)}%`;

                appendMessage(`Analysis Done: It looks like ${diagnosisData.diagnosis.diseaseName}.`, "bot");
            } else {
                appendMessage("Error: " + (result.message || "Failed to analyze"), "bot");
            }
        } catch (err) {
            appendMessage("Connection Error! Is the server running?", "bot");
        } finally {
            analyzeBtn.innerText = "Analyze Photo";
            document.getElementById("cancelUpload").click();
        }
    };

    // --- Logic الإضافي (Enter, Dark Mode, Sidebar) ---
    userInput.addEventListener("keypress", (e) => { if (e.key === "Enter") sendBtn.click(); });

    if (clearChatBtn) {
        clearChatBtn.onclick = () => {
            chatMessages.innerHTML = '<div class="bot-msg">Chat cleared. 🌿</div>';
            document.getElementById("analysisResult").style.display = "none";
        };
    }

    document.getElementById("openSidebar").onclick = () => sidebar.classList.add("active");
    document.getElementById("closeSidebar").onclick = () => sidebar.classList.remove("active");
    document.getElementById("darkToggle").onclick = () => document.body.classList.toggle("dark");
});