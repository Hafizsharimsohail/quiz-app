let currentUser = null;
let quizTimer;
let quizTimeLeft = 60;
let currentQuiz = null;
let currentQuestionIndex = 0;
let score = 0;

// Simulate a small database for users and quizzes
const users = [];
const quizzes = {
    html: [
        { question: "What does HTML stand for?", options: ["HyperText Markup Language", "HighText Markup Language", "HyperTest Markup Language"], answer: 0 },
        { question: "What is the correct HTML tag for the largest heading?", options: ["<h1>", "<h6>", "<heading>"], answer: 0 }
    ],
    css: [
        { question: "What does CSS stand for?", options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style Sheets"], answer: 0 },
        { question: "Which property is used to change the background color?", options: ["color", "background-color", "bg-color"], answer: 1 }
    ],
    js: [
        { question: "What does JS stand for?", options: ["JavaScript", "JavaServer", "JavaScriptS"], answer: 0 },
        { question: "Which symbol is used for comments in JavaScript?", options: ["//", "#", "/* */"], answer: 0 }
    ]
};

// Handle user authentication
document.getElementById('authForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert("Please fill in both fields.");
        return;
    }

    if (document.getElementById('authTitle').innerText === 'Signup') {
        users.push({ username, password });
        localStorage.setItem('users', JSON.stringify(users));
        alert("Signup Successful! You can now log in.");
        switchToLogin();
    } else {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            loadHomePage();
        } else {
            alert("Invalid username or password.");
        }
    }
});

function switchToLogin() {
    document.getElementById('authTitle').innerText = 'Login';
    document.getElementById('switchToLogin').style.display = 'none';
    document.getElementById('authForm').reset();
}

function loadHomePage() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    currentUser = user;
    document.getElementById('authPage').style.display = 'none';
    document.getElementById('homePage').style.display = 'block';
}

function startQuiz(topic) {
    currentQuiz = quizzes[topic];
    currentQuestionIndex = 0;
    score = 0;
    startTimer();
    showQuestion();
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('quizPage').style.display = 'block';
    document.getElementById('quizTopic').innerText = topic.toUpperCase() + " Quiz";
}

function startTimer() {
    quizTimeLeft = 60;
    document.getElementById('timer').innerText = "Time Left: " + quizTimeLeft;
    quizTimer = setInterval(function() {
        quizTimeLeft--;
        document.getElementById('timer').innerText = "Time Left: " + quizTimeLeft;
        if (quizTimeLeft <= 0) {
            clearInterval(quizTimer);
            alert("Time's up! Your score: " + score);
            document.getElementById('quizPage').style.display = 'none';
            document.getElementById('homePage').style.display = 'block';
        }
    }, 1000);
}

function showQuestion() {
    const question = currentQuiz[currentQuestionIndex];
    document.getElementById('quizQuestion').innerText = question.question;
    const optionsHtml = question.options.map((option, index) => 
        `<button onclick="checkAnswer(${index})">${option}</button>`
    ).join('');
    document.getElementById('quizOptions').innerHTML = optionsHtml;
}

function checkAnswer(selected) {
    if (selected === currentQuiz[currentQuestionIndex].answer) {
        score++;
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuiz.length) {
        showQuestion();
    } else {
        clearInterval(quizTimer);
        alert("Quiz completed! Your score: " + score);
        document.getElementById('quizPage').style.display = 'none';
        document.getElementById('homePage').style.display = 'block';
    }
}
