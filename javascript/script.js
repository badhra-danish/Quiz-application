const configCantaniar = document.querySelector(".config-container")
const quizCantaniar = document.querySelector(".Quiz-container")
const answerOption = document.querySelector(".answer-options")
const nextQuestion = document.querySelector(".next-question-btn")
const questionStatus = document.querySelector(".question-status")
const timerDisplay = document.querySelector(".timer-duration")
const resultCantaniar = document.querySelector(".result-container")

let quizTimelimit = 10;
let currentTime = quizTimelimit;
let timer = null;
let quizCategory = "programming";
let currentQuestion = null;
let numberofQuestion = 10;
let correctAnswercount = 0;
const questionIndexHistory = [];

//display the quiz result container and hide the quiz container ...  

const showQuizresult = () =>{
    quizCantaniar.style.display = "none";
    resultCantaniar.style.display = "block";

    const resultText = `You answered <b>${correctAnswercount}</b> out of <b>${numberofQuestion}</b> question Correctly. Great Effort!`
    document.querySelector(".result-msg").innerHTML = resultText
}

const resetTimer = () =>{
    clearInterval(timer);
    currentTime = quizTimelimit;
    timerDisplay.textContent = `${currentTime}s`;
}
// Intialize and the start the timer for the current question
const stratTimer = () => {
    timer = setInterval(() =>{
        currentTime--;
        timerDisplay.textContent = `${currentTime}s`;
        if(currentTime<= 0){
            clearInterval(timer);
            highlightCorrectAnswer();
            nextQuestion.style.visibility = "visible";
            quizCantaniar.querySelector(".quiz-timer").style.background = "#c31402"
            answerOption.querySelectorAll(".answer-option").forEach(option => option.style.pointerEvents = "none");

        }
     
    },1000)
   
}
// Fetch a random question from ont the category...

const getRondomQuestion = () => {
    const categoryQuestions =  questions.find(cat => cat.category.toLowerCase() === quizCategory.toLowerCase()).questions || [];

    if(questionIndexHistory.length >= Math.min(categoryQuestions.length, numberofQuestion)){
        showQuizresult();
    }
// Filter out already asked question and chosen a random one ...

    const availableQuestion = categoryQuestions.filter((_, index) => !questionIndexHistory.includes(index));

    const randonQuestion = availableQuestion[Math.floor(Math.random() * availableQuestion.length)];
    console.log(categoryQuestions.indexOf(randonQuestion));
   
    questionIndexHistory.push(categoryQuestions.indexOf(randonQuestion))

    return randonQuestion;
}
//Highlight the correct Option 
const highlightCorrectAnswer = () =>{
    const correctOption = answerOption.querySelectorAll(".answer-option")[currentQuestion.correctAnswer]
    correctOption.classList.add("correct");
    const iconHTML = `<span class="material-symbols-rounded">check_circle</span>`;
    correctOption.insertAdjacentHTML("beforeend",iconHTML);
}
// Handle User answer selection 
const handleAnswer = (option, answerIndex) => {
    clearInterval(timer);
    const isCorrect = currentQuestion.correctAnswer === answerIndex;
    option.classList.add(isCorrect ? 'correct': 'incorrect');
    !isCorrect ? highlightCorrectAnswer() :correctAnswercount++;
     
    const iconHTML = `<span class="material-symbols-rounded">${isCorrect ? 'check_circle' : 'cancel'}</span>`;
    option.insertAdjacentHTML("beforeend",iconHTML);

    //Disable all answer option after selected one
    answerOption.querySelectorAll(".answer-option").forEach(option => option.style.pointerEvents = "none");
    nextQuestion.style.visibility = "visible";
}
//render the current question and its option in quiz
const renderQuestion = () => {
    currentQuestion = getRondomQuestion();

    if(!currentQuestion) return;
    console.log(currentQuestion);
    resetTimer();
    stratTimer();

// update the UI    
    answerOption.innerHTML= "";
   document.querySelector(".question-text").textContent = currentQuestion.question;
   nextQuestion.style.visibility = "hidden";
   quizCantaniar.querySelector(".quiz-timer").style.background = "rgb(45, 44, 44)"
   questionStatus.innerHTML = `<b>${questionIndexHistory.length}</b> of <b>${numberofQuestion}</b> Question`;

//create option <li> element and append them
   currentQuestion.option.forEach((option, index) => {
    const li = document.createElement("li");
    li.classList.add("answer-option");
    li.textContent = option;
    answerOption.appendChild(li);
    li.addEventListener("click", () => handleAnswer(li, index))
   })
  
}

// start the quiz and render the question

const startQuiz = () =>{
    configCantaniar.style.display = "none";
    quizCantaniar.style.display = "block";

    quizCategory = configCantaniar.querySelector(".category-option.active").textContent;
    numberofQuestion = parseInt(configCantaniar.querySelector(".Question-option.active").textContent);
    renderQuestion();
}
// highlight the selected option on click category or no of question ... 

document.querySelectorAll(".category-option, .Question-option").forEach(option =>{
    option.addEventListener("click", () =>{
        option.parentNode.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    });
});

//reset the quiz and return the configuration container
const resetQuiz = () =>{
    resetTimer();
    correctAnswercount = 0;
    questionIndexHistory.length = 0;
    configCantaniar.style.display = "block";
    resultCantaniar.style.display = "none";
}

nextQuestion.addEventListener("click", renderQuestion);
document.querySelector(".tryagain-btn").addEventListener("click",resetQuiz)
document.querySelector(".start-quiz-btn").addEventListener("click",startQuiz)
