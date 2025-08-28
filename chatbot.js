// =============================
// Chatbot - Gravity Assistant
// =============================

// DOM Elements
const chatbotFab = document.getElementById('chatbotFab');
const chatbotContainer = document.getElementById('chatbotContainer');
const closeChatbotBtn = document.getElementById('closeChatbot');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChat');

// Store chat history
let chatHistory = [];

// API Configuration
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
let currentKeyIndex = 0;

// Load API keys from environment variables (for demo, using placeholder keys)
const GROQ_API_KEYS = [
    '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',
    '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', 
    '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'
].filter(key => key !== undefined && key !== null);

// -----------------------------
// Utility Functions
// -----------------------------

function toggleChatbot() {
    chatbotContainer.classList.toggle('hidden');
    if (!chatbotContainer.classList.contains('hidden')) {
        chatInput.focus();
    }
}

function appendMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('flex');

    const bubble = document.createElement('div');
    if (sender === 'user') {
        bubble.className = "bg-indigo-500/70 text-white px-3 py-2 rounded-lg w-fit ml-auto my-1";
    } else {
        bubble.className = "bg-purple-600/70 text-white px-3 py-2 rounded-lg w-fit my-1";
    }
    bubble.textContent = text;

    messageElement.appendChild(bubble);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    chatHistory.push({ text, sender });
}

function showLoadingIndicator() {
    const loadingElement = document.createElement('div');
    loadingElement.id = 'loadingIndicator';
    loadingElement.className = "flex space-x-1 mt-2";
    loadingElement.innerHTML = `
        <span class="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></span>
        <span class="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150"></span>
        <span class="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-300"></span>
    `;
    chatMessages.appendChild(loadingElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideLoadingIndicator() {
    const loadingElement = document.getElementById('loadingIndicator');
    if (loadingElement) loadingElement.remove();
}

function getCurrentApiKey() {
    return GROQ_API_KEYS[currentKeyIndex];
}

function moveToNextApiKey() {
    currentKeyIndex = (currentKeyIndex + 1) % GROQ_API_KEYS.length;
    console.log(`🔑 Moved to API key index: ${currentKeyIndex}`);
}

// -----------------------------
// Knowledge Base (from Gravity site)
// -----------------------------
// =============================
// Gravity Technology Knowledge Base
// =============================

const knowledgeBase = {
  // Company Information
  "Gravity": "Gravity Technology is a technology solutions provider based in Addis Ababa, Ethiopia, empowering businesses through intelligent digital solutions.",
  "Tagline": "Empowering your business through intelligent solutions.",
  "About": "At Gravity, we provide intelligent solutions for a data-driven world. We craft bespoke strategies to propel your business forward, helping you experience the pull of true innovation and measurable growth.",
  "Mission": "To empower businesses through innovative technology solutions that drive growth and efficiency.",
  "Vision": "To be the leading technology partner for businesses in Ethiopia and beyond, transforming how they operate and connect with customers.",
  "Values": "Innovation, Excellence, Customer-Centricity, Integrity, and Collaboration.",

  // Services
  "Services": "We provide Software Development, Networking, Website Hosting, and Hardware Setup.",
  "Software Development": "Tailored applications to streamline operations and enhance productivity. We create custom software solutions designed specifically for your business needs.",
  "Networking": "Reliable and secure networking solutions to keep your business connected. We design, implement, and maintain network infrastructure for optimal performance.",
  "Website Hosting": "High-performance, secure, and scalable hosting services to ensure your website is always available and fast.",
  "Hardware Setup": "Trusted IT infrastructure and hardware installation for smooth operations. We provide complete setup of computers, servers, and peripheral devices.",

  // Our Works/Projects
  "Our Works": "Some of our highlighted projects include Real Estate Website, Insurance Brokers Website, and Custom CRM Platform.",
  "Real Estate Website": "A full-featured platform to browse, buy, and sell properties. This comprehensive solution converts domains into fully functional content websites tailored for the real estate industry.",
  "Insurance Brokers Website": "A digital solution for managing policies, claims, and customer interactions. A robust platform designed for insurance brokers to manage their operations efficiently.",
  "Custom CRM Platform": "A CRM solution to manage leads, track performance, and optimize workflows. This powerful platform enables businesses to manage customer relationships, automate workflows, and gain actionable insights.",

  // Products
  "Our Products": "We provide ERP Website, CRM Website, AI Tools Website, and DevOps Website.",
  "ERP Website": "An all-in-one ERP solution with dashboards and analytics. Comprehensive features for businesses of all sizes including customizable dashboards, real-time analytics, scalable architecture, and seamless integration with existing systems.",
  "CRM Website": "A platform for managing leads, campaigns, and customer support. Features include lead tracking and automation, email & SMS marketing campaigns, integrated customer support system, and customer behavior analytics.",
  "AI Tools Website": "AI-powered productivity and automation tools. Includes AI text summarization for documents, document auto-tagging and organization, predictive insights and recommendations, and natural language processing capabilities.",
  "DevOps Website": "A continuous integration and deployment toolkit for businesses. Features cloud-native deployment pipelines, zero-downtime deployment strategies, advanced monitoring and alert systems, and automated testing and quality assurance.",

  // Contact Information
  "Contact": "📞 +251 910 446 666 | 📧 info@gravityet.com | 📍 Bisrate Gabriel, next to Adot Multiplex, Shimeket commercial center, 7th floor 708, Addis Ababa, Ethiopia",
  "Phone": "+251 910 446 666",
  "Email": "info@gravityet.com",
  "Address": "Bisrate Gabriel, next to Adot Multiplex, Shimeket commercial center, 7th floor 708, Addis Ababa, Ethiopia",
  "Location": "We are located in Addis Ababa, Ethiopia at Bisrate Gabriel, next to Adot Multiplex, Shimeket commercial center, 7th floor 708.",

  // Social Media
  "Social Media": "You can find us on Facebook, Instagram, and LinkedIn.",
  "Facebook": "Visit our Facebook page for updates and news.",
  "Instagram": "Follow us on Instagram to see our latest projects.",
  "LinkedIn": "Connect with us on LinkedIn for professional updates.",

  // Clients
  "Clients": "We have worked with various clients including Ad, Nasew, BM Insurance Brokers, and others. Our portfolio includes diverse businesses across different industries.",
  "Portfolio": "Our client portfolio includes businesses in insurance, real estate, construction, and various other sectors.",

  // FAQ
  "How to contact": "You can contact us by phone at +251 910 446 666, by email at info@gravityet.com, or visit our office at Bisrate Gabriel, next to Adot Multiplex, Shimeket commercial center, 7th floor 708, Addis Ababa, Ethiopia.",
  "Where are you located": "We are located in Addis Ababa, Ethiopia at Bisrate Gabriel, next to Adot Multiplex, Shimeket commercial center, 7th floor 708.",
  "What services do you offer": "We offer Software Development, Networking, Website Hosting, and Hardware Setup services.",
  "What products do you have": "We have ERP Website, CRM Website, AI Tools Website, and DevOps Website products.",
  "How much do services cost": "Our pricing varies based on project requirements. Please contact us for a customized quote tailored to your specific needs.",
  "How long does a project take": "Project timelines depend on the scope and complexity. We provide estimated timelines after understanding your requirements.",
  "Do you provide support": "Yes, we provide ongoing support and maintenance for all our products and services.",
  "What industries do you serve": "We serve various industries including real estate, insurance, construction, and many others.",
  
  // Website sections
  "Hero": "Our homepage features our tagline 'Building Smarter Software for a Smarter Future' and highlights our mission to provide intelligent solutions.",
  "Homepage": "Our homepage introduces Gravity Technology and our services with a modern, engaging design.",
  
  // Additional information from the website content
  "Website Builder": "We offer a user-friendly solution enabling businesses to build polished websites seamlessly with an intuitive design process.",
  "Heartfelt Connections": "We believe in connecting hearts through technology, forging seamless connections that transform client relationships into lasting success."
};

// Enhanced search function with synonym matching
function searchFAQ(question) {
    const lowerQuestion = question.toLowerCase();
    
    // Synonyms mapping
    const synonyms = {
        "software": ["software", "application", "app", "program", "development"],
        "network": ["network", "networking", "internet", "connectivity", "wifi"],
        "hosting": ["hosting", "server", "website hosting", "web hosting", "cloud"],
        "hardware": ["hardware", "computer", "setup", "equipment", "infrastructure"],
        "erp": ["erp", "enterprise resource planning", "business management"],
        "crm": ["crm", "customer relationship management", "client management"],
        "ai": ["ai", "artificial intelligence", "machine learning", "automation"],
        "devops": ["devops", "development operations", "deployment", "ci/cd"],
        "contact": ["contact", "reach", "call", "email", "visit", "location"],
        "address": ["address", "location", "where", "find", "office"],
        "price": ["price", "cost", "how much", "fee", "pricing"],
        "time": ["time", "how long", "duration", "timeline", "schedule"]
    };
    
    // First try direct match
    for (const [key, value] of Object.entries(knowledgeBase)) {
        if (lowerQuestion.includes(key.toLowerCase())) {
            return value;
        }
    }
    
    // Then try synonym matching
    for (const [concept, words] of Object.entries(synonyms)) {
        if (words.some(word => lowerQuestion.includes(word))) {
            // Return the most relevant answer based on the concept
            switch(concept) {
                case "software": return knowledgeBase["Software Development"];
                case "network": return knowledgeBase["Networking"];
                case "hosting": return knowledgeBase["Website Hosting"];
                case "hardware": return knowledgeBase["Hardware Setup"];
                case "erp": return knowledgeBase["ERP Website"];
                case "crm": return knowledgeBase["CRM Website"];
                case "ai": return knowledgeBase["AI Tools Website"];
                case "devops": return knowledgeBase["DevOps Website"];
                case "contact": return knowledgeBase["Contact"];
                case "address": return knowledgeBase["Address"];
                case "price": return knowledgeBase["How much do services cost"];
                case "time": return knowledgeBase["How long does a project take"];
            }
        }
    }
    
    return null;
}

// -----------------------------
// Chat Logic
// -----------------------------
async function sendMessage() {
    const prompt = chatInput.value.trim();
    if (prompt === '') return;

    appendMessage(prompt, 'user');
    chatInput.value = '';
    showLoadingIndicator();

    try {
        const lowerPrompt = prompt.toLowerCase();

        // Quick responses
        if (["hi", "hello", "hey"].some(g => lowerPrompt.includes(g))) {
            hideLoadingIndicator();
            appendMessage("Hello 👋! How can I assist you today?", 'bot');
            return;
        }
        if (["thanks", "thank you"].some(t => lowerPrompt.includes(t))) {
            hideLoadingIndicator();
            appendMessage("You're welcome! 😊", 'bot');
            return;
        }
        if (["bye", "goodbye"].some(b => lowerPrompt.includes(b))) {
            hideLoadingIndicator();
            appendMessage("Goodbye! 👋 Reach out anytime.", 'bot');
            return;
        }

        // Knowledge Base
        const faqResponse = searchFAQ(prompt);
        if (faqResponse) {
            hideLoadingIndicator();
            appendMessage(faqResponse, 'bot');
            return;
        }

        // Fallback: Groq API
        const context = Object.entries(knowledgeBase)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n\n");

        const messages = [
            {
                role: "system",
                content: `You are Gravity Assistant, a helpful support bot for Gravity Technology in Ethiopia. 
                Use this company knowledge to answer:
                
                ${context}
                
                If the info is not available, politely say so and offer to connect the user with a human.
                Keep responses concise and professional.`
            },
            { role: "user", content: prompt }
        ];

        let data = null;
        let lastError = null;
        let attempts = 0;
        const maxAttempts = GROQ_API_KEYS.length;

        while (attempts < maxAttempts) {
            const apiKey = getCurrentApiKey();
            console.log(`🔑 Attempt ${attempts + 1}: Using API key index: ${currentKeyIndex}`);
            
            try {
                const response = await fetch(GROQ_API_URL, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: "llama-3.1-8b-instant",
                        messages,
                        temperature: 0.7,
                        max_tokens: 512
                    })
                });

                if (response.ok) {
                    data = await response.json();
                    break;
                } else {
                    lastError = new Error(`API error: ${response.status}`);
                    console.warn(`⚠️ API key index ${currentKeyIndex} failed`);
                    moveToNextApiKey();
                    attempts++;
                }
            } catch (err) {
                lastError = err;
                console.warn(`⚠️ API key index ${currentKeyIndex} error: ${err.message}`);
                moveToNextApiKey();
                attempts++;
            }
        }

        hideLoadingIndicator();

        if (data && data.choices && data.choices.length > 0) {
            const botResponse = data.choices[0].message.content;
            appendMessage(botResponse, 'bot');
        } else {
            console.error('All API keys failed:', lastError);
            appendMessage("I'm not sure how to answer that. Would you like me to connect you with a human representative?", 'bot');
        }

    } catch (error) {
        console.error('Unexpected error:', error);
        hideLoadingIndicator();
        appendMessage("I'm having trouble right now. Please try again later or contact us directly.", 'bot');
    }
}

// -----------------------------
// Event Listeners
// -----------------------------
// Add these event listeners after DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const chatbotFab = document.getElementById('chatbotFab');
    const chatbotContainer = document.getElementById('chatbotContainer');
    const closeChatbotBtn = document.getElementById('closeChatbot');
    const chatInput = document.getElementById('chatInput');
    const sendChatBtn = document.getElementById('sendChat');
    
    // Add event listeners
    if (chatbotFab) {
        chatbotFab.addEventListener('click', toggleChatbot);
    }
    
    if (closeChatbotBtn) {
        closeChatbotBtn.addEventListener('click', toggleChatbot);
    }
    
    if (sendChatBtn) {
        sendChatBtn.addEventListener('click', sendMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    console.log("Chatbot initialized successfully");
});