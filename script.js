// ==========================================
// EduPulse AI v3.0
// Intelligent Student Feedback Chatbot
// ==========================================

// -------------------------------
// VARIABLES
// -------------------------------

let currentStep = 0;
let currentAIQuestion = 0;
let currentMode = "details";

const answers = {};

const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const dropdown = document.getElementById("dropdownInput");
const quickReplies = document.getElementById("quickReplies");

const progressFill = document.getElementById("progressFill");
const progressValue = document.getElementById("progressValue");

// -------------------------------
// STUDENT DETAILS
// -------------------------------

const detailQuestions = [

{
key:"name",
question:"👋 Hello! Welcome to EduPulse AI.<br><br>Let's begin! What's your name?",
type:"text"
},

{
key:"email",
question:"Nice to meet you 😊<br><br>Please enter your College Email.",
type:"text"
},

{
key:"department",
question:"Which department are you studying in?",
type:"dropdown",
options:[
"Mechanical Engineering",
"Computer Science and Engineering",
"Information Technology",
"Artificial Intelligence & Data Science",
"Electronics and Communication Engineering",
"Electrical and Electronics Engineering",
"Civil Engineering",
"Biomedical Engineering",
"Chemical Engineering"
]
},

{
key:"year",
question:"Which year are you currently studying?",
type:"dropdown",
options:[
"I Year",
"II Year",
"III Year",
"IV Year"
]
},

{
key:"subject",
question:"Which subject is this feedback for?",
type:"dropdown",
options:[
"Mathematics",
"Physics",
"Chemistry",
"Engineering Graphics",
"Python",
"Tamil"
]
},

{
key:"faculty",
question:"Please select your faculty.",
type:"faculty"
}

];

// -------------------------------
// FACULTY LIST
// -------------------------------

const facultyData = {

"Mathematics":[
"Kalaivani",
"Yugesh",
"Sampath"
],

"Physics":[
"Julie Charles",
"Balaji",
"Anandha Babu"
],

"Chemistry":[
"Murugesan",
"Mahalakshmi",
"Shanmugaraj"
],

"Engineering Graphics":[
"Alwin",
"Alphin",
"Hari Krishna"
],

"Python":[
"Nepolean Keisham",
"Sudha",
"Sornavalli"
],

"Tamil":[
"Clinton Britto",
"Srinivasan",
"Ram Smaran"
]

};

// -------------------------------
// AI QUESTIONS
// -------------------------------

const aiQuestions = [

{
id:"mood",
question:"😊 Before we begin... How are you feeling after today's class?",
type:"buttons",
options:[
"🤩 Excited",
"😊 Happy",
"😐 Okay",
"😴 Tired",
"😕 Frustrated"
]
},

{
id:"classRating",
question:"📚 How would you rate today's class overall?",
type:"buttons",
options:[
"🤩 Excellent",
"😊 Good",
"😐 Average",
"😕 Confusing",
"😴 Boring"
]
},

{
id:"interaction",
question:"👨‍🏫 How interactive was the faculty?",
type:"buttons",
options:[
"⭐⭐⭐⭐⭐ Excellent",
"⭐⭐⭐⭐ Good",
"⭐⭐⭐ Average",
"⭐⭐ Poor",
"⭐ Very Poor"
]
},

{
id:"clarity",
question:"💡 Were the concepts explained clearly?",
type:"buttons",
options:[
"Crystal Clear",
"Mostly Clear",
"Average",
"Difficult",
"Very Difficult"
]
},

{
id:"doubts",
question:"❓Did the faculty encourage students to ask doubts?",
type:"buttons",
options:[
"Always",
"Sometimes",
"Rarely",
"Never"
]
},

{
id:"pace",
question:"⏱️ How was today's teaching pace?",
type:"buttons",
options:[
"Perfect",
"Too Fast",
"Too Slow"
]
}

]; 
// ==========================================
// PART 2 — CHAT FUNCTIONS & UI
// ==========================================

// -------------------------------
// BOT MESSAGE
// -------------------------------

function botMessage(message) {

    const div = document.createElement("div");

    div.className = "bot";

    div.innerHTML = "🤖 " + message;

    chatBox.appendChild(div);

    chatBox.scrollTop = chatBox.scrollHeight;
}


// -------------------------------
// USER MESSAGE
// -------------------------------

function userMessage(message) {

    const div = document.createElement("div");

    div.className = "user";

    div.innerHTML = message;

    chatBox.appendChild(div);

    chatBox.scrollTop = chatBox.scrollHeight;
}


// -------------------------------
// TYPING INDICATOR
// -------------------------------

function showTyping(callback, delay = 900) {

    const typingArea = document.getElementById("typingArea");

    if (typingArea) {

        typingArea.style.display = "flex";

    }

    setTimeout(function () {

        if (typingArea) {

            typingArea.style.display = "none";

        }

        callback();

    }, delay);
}


// -------------------------------
// PROGRESS
// -------------------------------

function updateProgress() {

    /*
       There are 6 student-detail steps
       + 6 AI rating questions
       + deep feedback questions.
    */

    let total = 15;

    let percent = Math.min(
        Math.round((currentStep / total) * 100),
        100
    );

    if (progressFill) {

        progressFill.style.width = percent + "%";

    }

    if (progressValue) {

        progressValue.innerHTML = percent + "%";

    }
}


// -------------------------------
// CLEAR QUICK REPLIES
// -------------------------------

function clearQuickReplies() {

    if (quickReplies) {

        quickReplies.innerHTML = "";

    }

}


// -------------------------------
// QUICK REPLY BUTTONS
// -------------------------------

function showQuickReplies(options) {

    clearQuickReplies();

    options.forEach(function (option) {

        const button = document.createElement("button");

        button.className = "quick-btn";

        button.innerHTML = option;

        button.onclick = function () {

            handleQuickReply(option);

        };

        quickReplies.appendChild(button);

    });

    chatBox.scrollTop = chatBox.scrollHeight;
}


// -------------------------------
// DROPDOWN LOADER
// -------------------------------

function loadDropdown(options) {

    dropdown.innerHTML = "";

    const first = document.createElement("option");

    first.value = "";

    first.textContent = "-- Select --";

    dropdown.appendChild(first);


    options.forEach(function (item) {

        const option = document.createElement("option");

        option.value = item;

        option.textContent = item;

        dropdown.appendChild(option);

    });

}


// -------------------------------
// INPUT MODE
// -------------------------------

function showTextInput(placeholder = "Type your answer...") {

    dropdown.style.display = "none";

    input.style.display = "block";

    input.placeholder = placeholder;

    input.value = "";

    input.focus();

}


// -------------------------------
// DROPDOWN MODE
// -------------------------------

function showDropdown(options) {

    input.style.display = "none";

    dropdown.style.display = "block";

    loadDropdown(options);

}


// -------------------------------
// AI RESPONSE
// -------------------------------

function aiReply(message, delay = 900) {

    showTyping(function () {

        botMessage(message);

    }, delay);

}


// -------------------------------
// INITIAL CHAT
// -------------------------------

window.addEventListener("load", function () {

    updateProgress();

    clearQuickReplies();

    showTextInput("Enter your name...");


    botMessage(
        "👋 Hello! Welcome to <strong>EduPulse AI</strong>."
    );


    setTimeout(function () {

        botMessage(
            "I'm your AI Feedback Assistant 🤖"
        );

    }, 700);


    setTimeout(function () {

        botMessage(
            "Instead of filling out a boring feedback form, " +
            "let's have a quick conversation about your learning experience."
        );

    }, 1400);


    setTimeout(function () {

        botMessage(
            "It'll only take a couple of minutes. Ready? 😊"
        );

    }, 2200);


    setTimeout(function () {

        botMessage(
            "First, what's your name?"
        );

    }, 3000);

});


// -------------------------------
// ENTER KEY
// -------------------------------

input.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        event.preventDefault();

        sendMessage();

    }

});


// -------------------------------
// ESCAPE HTML
// -------------------------------

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

} 
// ==========================================
// PART 3 — STUDENT DETAILS FLOW
// ==========================================

// -------------------------------
// ASK CURRENT DETAIL QUESTION
// -------------------------------

function askDetailQuestion() {

    const question = detailQuestions[currentStep];

    if (!question) {

        startAIConversation();

        return;

    }

    clearQuickReplies();

    // ---------------------------
    // TEXT QUESTION
    // ---------------------------

    if (question.type === "text") {

        showTextInput(
            question.key === "name"
                ? "Enter your name..."
                : "Enter your college email..."
        );

        aiReply(question.question);

        return;
    }


    // ---------------------------
    // NORMAL DROPDOWN
    // ---------------------------

    if (question.type === "dropdown") {

        showDropdown(question.options);

        aiReply(question.question);

        return;
    }


    // ---------------------------
    // FACULTY DROPDOWN
    // ---------------------------

    if (question.type === "faculty") {

        const selectedSubject = answers.subject;

        const facultyList = facultyData[selectedSubject] || [];

        showDropdown(facultyList);

        aiReply(question.question);

    }

}


// -------------------------------
// VALIDATE EMAIL
// -------------------------------

function validEmail(email) {

    const pattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(email);

}


// -------------------------------
// PROCESS STUDENT DETAILS
// -------------------------------

function processDetailAnswer(text) {

    const question = detailQuestions[currentStep];

    if (!question) {

        startAIConversation();

        return;

    }


    // ---------------------------
    // NAME
    // ---------------------------

    if (question.key === "name") {

        if (text.length < 2) {

            aiReply(
                "Could you enter your full name? 😊"
            );

            return;

        }

    }


    // ---------------------------
    // EMAIL
    // ---------------------------

    if (question.key === "email") {

        if (!validEmail(text)) {

            aiReply(
                "Hmm, that doesn't look like a valid email address. 📧<br><br>" +
                "Please enter your college email again."
            );

            return;

        }

    }


    // ---------------------------
    // SAVE ANSWER
    // ---------------------------

    answers[question.key] = text;


    // ---------------------------
    // CLEAR INPUT
    // ---------------------------

    input.value = "";


    // ---------------------------
    // MOVE TO NEXT STEP
    // ---------------------------

    currentStep++;

    updateProgress();


    // ---------------------------
    // FINISHED DETAILS
    // ---------------------------

    if (currentStep >= detailQuestions.length) {

        finishStudentDetails();

        return;

    }


    // ---------------------------
    // NEXT QUESTION
    // ---------------------------

    setTimeout(function () {

        askDetailQuestion();

    }, 500);

}


// -------------------------------
// FINISH STUDENT DETAILS
// -------------------------------

function finishStudentDetails() {

    clearQuickReplies();

    dropdown.style.display = "none";

    input.style.display = "block";

    input.placeholder = "Type your answer...";


    aiReply(
        "Perfect, " +
        escapeHTML(answers.name) +
        "! 🎉"
    );


    setTimeout(function () {

        botMessage(
            "I've got your academic details."
        );

    }, 1500);


    setTimeout(function () {

        botMessage(
            "Now comes the interesting part. 😄"
        );

    }, 2300);


    setTimeout(function () {

        botMessage(
            "Instead of asking you to rate everything at once, " +
            "I'll ask a few quick questions and then ask for your honest thoughts."
        );

    }, 3100);


    setTimeout(function () {

        currentAIQuestion = 0;

        currentMode = "ai";

        askAIQuestion();

    }, 4200);

} 
// ==========================================
// PART 4 — AI CONVERSATION & ADAPTIVE QUESTIONS
// ==========================================

// -------------------------------
// START AI CONVERSATION
// -------------------------------

function startAIConversation() {

    currentMode = "ai";

    currentAIQuestion = 0;

    clearQuickReplies();

    setTimeout(function () {

        askAIQuestion();

    }, 500);

}


// -------------------------------
// ASK AI QUESTION
// -------------------------------

function askAIQuestion() {

    if (currentAIQuestion >= aiQuestions.length) {

        startDeepFeedback();

        return;

    }

    const question = aiQuestions[currentAIQuestion];

    clearQuickReplies();

    showTextInput("Type your answer...");

    aiReply(question.question, 700);


    setTimeout(function () {

        if (question.type === "buttons") {

            showQuickReplies(question.options);

        }

    }, 900);

}


// -------------------------------
// HANDLE QUICK REPLY
// -------------------------------

function handleQuickReply(option) {

    clearQuickReplies();

    userMessage(option);

    saveAIAnswer(option);

}


// -------------------------------
// SAVE AI ANSWER
// -------------------------------

function saveAIAnswer(answer) {

    const question = aiQuestions[currentAIQuestion];

    if (!question) {

        return;

    }

    answers[question.id] = answer;

    currentStep++;

    updateProgress();

    // ---------------------------
    // PERSONALIZED RESPONSE
    // ---------------------------

    setTimeout(function () {

        giveAdaptiveResponse(question.id, answer);

    }, 500);

}


// -------------------------------
// ADAPTIVE RESPONSE
// -------------------------------

function giveAdaptiveResponse(questionId, answer) {

    let response = "";


    // ---------------------------
    // MOOD
    // ---------------------------

    if (questionId === "mood") {

        if (
            answer.includes("Excited") ||
            answer.includes("Happy")
        ) {

            response =
                "That's great to hear! 😊 " +
                "It sounds like you're having a positive learning experience.";

        }

        else if (answer.includes("Frustrated")) {

            response =
                "Thanks for being honest. ❤️ " +
                "Let's understand what caused that frustration.";

        }

        else {

            response =
                "Thanks for sharing that. 😊 " +
                "Let's take a closer look at today's class.";

        }

    }


    // ---------------------------
    // CLASS RATING
    // ---------------------------

    else if (questionId === "classRating") {

        if (answer.includes("Excellent")) {

            response =
                "Wonderful! 🌟 " +
                "I'd love to know what made today's class stand out.";

        }

        else if (
            answer.includes("Confusing") ||
            answer.includes("Boring")
        ) {

            response =
                "Thanks for being honest. 👍 " +
                "Your feedback can help improve future classes.";

        }

        else {

            response =
                "Got it! Thanks for sharing your perspective.";

        }

    }


    // ---------------------------
    // INTERACTION
    // ---------------------------

    else if (questionId === "interaction") {

        if (
            answer.includes("Excellent") ||
            answer.includes("Good")
        ) {

            response =
                "That's encouraging! 👨‍🏫 " +
                "Interaction can make a big difference in learning.";

        }

        else {

            response =
                "I understand. More interaction could potentially make the class more engaging.";

        }

    }


    // ---------------------------
    // CLARITY
    // ---------------------------

    else if (questionId === "clarity") {

        if (answer.includes("Crystal")) {

            response =
                "Excellent! 💡 Clear explanations make difficult concepts much easier.";

        }

        else if (
            answer.includes("Difficult") ||
            answer.includes("Very Difficult")
        ) {

            response =
                "Thanks for pointing that out. " +
                "Let's explore which part was difficult.";

        }

        else {

            response =
                "Thanks! Understanding clarity helps us identify where teaching can improve.";

        }

    }


    // ---------------------------
    // DOUBTS
    // ---------------------------

    else if (questionId === "doubts") {

        if (answer === "Always") {

            response =
                "That's excellent! 🙋 Encouraging questions creates a healthy learning environment.";

        }

        else if (answer === "Never") {

            response =
                "I understand. Giving students more opportunities to ask questions could help.";

        }

        else {

            response =
                "Thanks for sharing. Student participation is an important part of learning.";

        }

    }


    // ---------------------------
    // PACE
    // ---------------------------

    else if (questionId === "pace") {

        if (answer === "Perfect") {

            response =
                "Great! ⏱️ A comfortable pace makes it easier to follow the lesson.";

        }

        else if (answer === "Too Fast") {

            response =
                "Got it. Slowing down at important concepts could make them easier to understand.";

        }

        else if (answer === "Too Slow") {

            response =
                "Thanks. A slightly faster pace might help keep the class more engaging.";

        }

    }


    // ---------------------------
    // SHOW RESPONSE
    // ---------------------------

    aiReply(response, 800);


    // ---------------------------
    // MOVE TO NEXT QUESTION
    // ---------------------------

    setTimeout(function () {

        currentAIQuestion++;

        askAIQuestion();

    }, 1900);

} 
// ==========================================
// PART 5 — DEEP FEEDBACK CONVERSATION
// ==========================================

const deepQuestions = [

    {
        id: "favoritePart",
        question:
            "🌟 What did you enjoy the most about today's class?",
        placeholder:
            "Tell me what you enjoyed..."
    },

    {
        id: "difficultTopic",
        question:
            "🧠 Was there any topic or concept that you found difficult?",
        placeholder:
            "Tell me which topic was difficult..."
    },

    {
        id: "facultyStrength",
        question:
            "👨‍🏫 What do you think your faculty did particularly well?",
        placeholder:
            "Tell me what the faculty did well..."
    },

    {
        id: "improvement",
        question:
            "💡 If you could change one thing about today's class, what would it be?",
        placeholder:
            "What would you improve?"
    },

    {
        id: "teachingMethod",
        question:
            "📚 What teaching method would make this subject more interesting for you?",
        placeholder:
            "For example: activities, examples, demonstrations..."
    },

    {
        id: "suggestion",
        question:
            "🚀 Do you have any suggestion that could make future classes better?",
        placeholder:
            "Share your suggestion..."
    },

    {
        id: "finalFeedback",
        question:
            "❤️ Finally, is there anything else you'd like your faculty to know?",
        placeholder:
            "Write anything you'd like to share..."
    }

];


// -------------------------------
// DEEP QUESTION INDEX
// -------------------------------

let deepQuestionIndex = 0;


// -------------------------------
// START DEEP FEEDBACK
// -------------------------------

function startDeepFeedback() {

    currentMode = "deep";

    deepQuestionIndex = 0;

    clearQuickReplies();

    showTextInput(
        deepQuestions[0].placeholder
    );

    setTimeout(function () {

        botMessage(
            "👍 Thanks for answering those quick questions."
        );

    }, 600);

    setTimeout(function () {

        botMessage(
            "Now I'd like to hear your own thoughts. " +
            "There are no right or wrong answers."
        );

    }, 1400);

    setTimeout(function () {

        askDeepQuestion();

    }, 2300);

}


// -------------------------------
// ASK DEEP QUESTION
// -------------------------------

function askDeepQuestion() {

    if (
        deepQuestionIndex >=
        deepQuestions.length
    ) {

        finishConversation();

        return;

    }

    const question =
        deepQuestions[deepQuestionIndex];


    showTextInput(
        question.placeholder
    );


    aiReply(
        question.question,
        700
    );

}


// -------------------------------
// PROCESS DEEP ANSWER
// -------------------------------

function processDeepAnswer(text) {

    const question =
        deepQuestions[deepQuestionIndex];


    if (!question) {

        finishConversation();

        return;

    }


    // ---------------------------
    // BASIC VALIDATION
    // ---------------------------

    if (text.trim().length < 2) {

        aiReply(
            "Could you tell me a little more? " +
            "Even a short sentence is helpful. 😊"
        );

        return;

    }


    // ---------------------------
    // STORE ANSWER
    // ---------------------------

    answers[question.id] =
        text.trim();


    // ---------------------------
    // SHOW USER MESSAGE
    // ---------------------------

    userMessage(
        escapeHTML(text.trim())
    );


    input.value = "";


    // ---------------------------
    // PERSONALIZED ACKNOWLEDGEMENT
    // ---------------------------

    const acknowledgements = [

        "That's a thoughtful answer. 😊",

        "Thanks for sharing that honestly.",

        "That's useful feedback. 👍",

        "I appreciate you explaining that.",

        "That's an interesting perspective.",

        "Thanks! That gives me a better understanding.",

        "Your feedback is valuable."
    ];


    const acknowledgement =
        acknowledgements[
            Math.floor(
                Math.random() *
                acknowledgements.length
            )
        ];


    aiReply(
        acknowledgement,
        700
    );


    // ---------------------------
    // MOVE TO NEXT QUESTION
    // ---------------------------

    deepQuestionIndex++;

    currentStep++;

    updateProgress();


    setTimeout(function () {

        if (
            deepQuestionIndex <
            deepQuestions.length
        ) {

            askDeepQuestion();

        }

        else {

            finishConversation();

        }

    }, 1600);

}


// -------------------------------
// FINISH CONVERSATION
// -------------------------------

function finishConversation() {

    currentMode = "finished";

    clearQuickReplies();

    input.disabled = true;

    dropdown.disabled = true;


    aiReply(
        "🎉 That's everything I wanted to ask!"
    );


    setTimeout(function () {

        botMessage(
            "Thank you, " +
            escapeHTML(answers.name) +
            ". ❤️"
        );

    }, 1500);


    setTimeout(function () {

        botMessage(
            "I'm going to save your feedback now..."
        );

    }, 2400);


    setTimeout(function () {

        saveFeedback();

    }, 3200);

} 
// ==========================================
// PART 6 — SEND CONTROLLER + EXCEL SAVE
// ==========================================


// -------------------------------
// SEND MESSAGE
// -------------------------------

function sendMessage() {

    // --------------------------------
    // Do nothing after conversation ends
    // --------------------------------

    if (currentMode === "finished") {

        return;

    }


    // --------------------------------
    // AI QUICK-REPLY MODE
    // --------------------------------

    if (currentMode === "ai") {

        const text = input.value.trim();

        /*
        The AI questions are normally answered
        using the buttons.

        But we still allow typing if the student
        wants to give their own answer.
        */

        if (text === "") {

            alert("Please select an option or type an answer.");

            return;

        }

        userMessage(
            escapeHTML(text)
        );

        saveAIAnswer(text);

        input.value = "";

        return;

    }


    // --------------------------------
    // DEEP FEEDBACK MODE
    // --------------------------------

    if (currentMode === "deep") {

        const text = input.value.trim();

        if (text === "") {

            alert("Please type your answer.");

            return;

        }

        processDeepAnswer(text);

        return;

    }


    // --------------------------------
    // STUDENT DETAILS MODE
    // --------------------------------

    if (currentMode === "details") {

        const question =
            detailQuestions[currentStep];

        if (!question) {

            startAIConversation();

            return;

        }


        // ------------------------------
        // TEXT INPUT
        // ------------------------------

        if (question.type === "text") {

            const text =
                input.value.trim();


            if (text === "") {

                alert("Please enter a value.");

                return;

            }


            /*
            IMPORTANT:

            Display the student's answer
            only after validation.
            */

            if (
                question.key === "email" &&
                !validEmail(text)
            ) {

                aiReply(
                    "📧 That doesn't look like a valid email address.<br><br>" +
                    "Please enter your college email again."
                );

                return;

            }


            userMessage(
                escapeHTML(text)
            );


            processDetailAnswer(text);

            return;

        }


        // ------------------------------
        // DROPDOWN INPUT
        // ------------------------------

        if (
            question.type === "dropdown" ||
            question.type === "faculty"
        ) {

            const selected =
                dropdown.value;


            if (selected === "") {

                alert("Please select an option.");

                return;

            }


            userMessage(
                escapeHTML(selected)
            );


            processDetailAnswer(selected);

            return;

        }

    }

}


// ==========================================
// SAVE TO FLASK
// ==========================================

function saveFeedback() {

    /*
    Create the complete object that will
    be sent to Flask.

    This contains both the original
    student information and the new
    AI conversation answers.
    */

    const feedbackData = {

        // ---------------------------
        // STUDENT DETAILS
        // ---------------------------

        name:
            answers.name || "",

        email:
            answers.email || "",

        department:
            answers.department || "",

        year:
            answers.year || "",

        subject:
            answers.subject || "",

        faculty:
            answers.faculty || "",


        // ---------------------------
        // QUICK AI QUESTIONS
        // ---------------------------

        mood:
            answers.mood || "",

        classRating:
            answers.classRating || "",

        interaction:
            answers.interaction || "",

        clarity:
            answers.clarity || "",

        doubts:
            answers.doubts || "",

        pace:
            answers.pace || "",


        // ---------------------------
        // DEEP QUESTIONS
        // ---------------------------

        favoritePart:
            answers.favoritePart || "",

        difficultTopic:
            answers.difficultTopic || "",

        facultyStrength:
            answers.facultyStrength || "",

        improvement:
            answers.improvement || "",

        teachingMethod:
            answers.teachingMethod || "",

        suggestion:
            answers.suggestion || "",

        finalFeedback:
            answers.finalFeedback || ""

    };


    console.log(
        "Sending feedback:",
        feedbackData
    );


    // ---------------------------
    // SEND TO FLASK
    // ---------------------------

    fetch("/save", {

        method: "POST",

        headers: {

            "Content-Type":
                "application/json"

        },

        body:
            JSON.stringify(feedbackData)

    })


    // ---------------------------
    // SERVER RESPONSE
    // ---------------------------

    .then(function(response) {

        if (!response.ok) {

            throw new Error(
                "Server returned an error."
            );

        }

        return response.json();

    })


    .then(function(data) {

        console.log(
            "Server response:",
            data
        );


        if (
            data.status === "success"
        ) {

            showSavedMessage();

        }

        else {

            throw new Error(
                data.message ||
                "Unable to save feedback."
            );

        }

    })


    // ---------------------------
    // ERROR
    // ---------------------------

    .catch(function(error) {

        console.error(
            "Save Error:",
            error
        );


        input.disabled = false;

        dropdown.disabled = false;


        botMessage(
            "❌ I couldn't save your feedback right now."
        );


        setTimeout(function() {

            botMessage(
                "Please make sure the Flask server is running and try again."
            );

        }, 1000);

    });

}


// ==========================================
// SAVED SUCCESSFULLY
// ==========================================

function showSavedMessage() {

    currentMode = "finished";


    if (input) {

        input.disabled = true;

    }


    if (dropdown) {

        dropdown.disabled = true;

    }


    clearQuickReplies();


    aiReply(
        "✅ Your feedback has been saved successfully!",
        700
    );


    setTimeout(function() {

        botMessage(
            "Thank you for taking the time to share your experience, " +
            escapeHTML(answers.name) +
            ". ❤️"
        );

    }, 1500);


    setTimeout(function() {

        botMessage(
            "Your responses will help improve future classes and the learning experience."
        );

    }, 2600);


    setTimeout(function() {

        botMessage(
            "🎓 Thank you for using EduPulse AI!"
        );

    }, 3700);


    /*
    Completion progress
    */

    currentStep = 15;

    updateProgress();

}


// ==========================================
// OPTIONAL RESET
// ==========================================

function resetConversation() {

    location.reload();

} 