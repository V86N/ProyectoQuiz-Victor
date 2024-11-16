const startBtn = document.getElementById('start-btn');
const quizContainer = document.getElementById('quiz-container');
const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options');
const resultContainer = document.getElementById('result-container');
const scoreElement = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');

let questions = [];
let currentQuestionIndex = 0;
let score = 0;


async function axiosQuestions() {
    try {
        const response = await axios.get('https://opentdb.com/api.php?amount=10&difficulty=easy');
        questions = response.data.results.map(q => ({
            question: q.question,
            correctAnswer: q.correct_answer,
            options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5)
        }));
    } catch (error) {
        console.error("Error: ", error);
        alert("No se pudieron cargar las preguntas. Por favor, inténtalo de nuevo más tarde.");
    }
}


startBtn.addEventListener('click', async () => {
    await axiosQuestions();
    if (questions.length === 0) {
        return; 
    }
    startBtn.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
});


function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerHTML = currentQuestion.question;
    optionsContainer.innerHTML = '';

    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.innerHTML = option;
        button.classList.add('btn', 'option-btn');
        button.addEventListener('click', () => selectAnswer(option));
        optionsContainer.appendChild(button);
    });
}


function selectAnswer(selectedOption) {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.correctAnswer) {
        score++;
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}


function showResult() {
    quizContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    scoreElement.innerHTML = `Has respondido correctamente ${score} de ${questions.length} preguntas.`;
}


restartBtn.addEventListener('click', () => {
    resultContainer.classList.add('hidden');
    startBtn.classList.remove('hidden');
});

