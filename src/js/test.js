// test class
class test {
    constructor(time, questions) {
        this.time = time;
        this.questions = questions;

        // Bind methods to preserve 'this' context
        this.generate_test = this.generate_test.bind(this);
        this.start_timer = this.start_timer.bind(this);
        this.time_over = this.time_over.bind(this);
    };

    get generate() {
        return this.generate_test();
    }

    get timer() {
        return this.start_timer(this.time_over);
    }
    // function for dynamically generating test questions
    generate_test = function() {
        console.log("Generating test...");

        // loops over all the questions in the test object
        for (let question_index in this.questions) {
            console.log(question_index);
            console.log("Full question object:", this.questions[question_index]); // Debug: see the whole object

            let template = document.getElementById("question_template");
            let clone = template.content.cloneNode(true);

            let question_form = clone.querySelector(".question_form");
            question_form.id = "question_" + question_index;

            let question_title = clone.querySelector(".question_title");
            question_title.innerHTML = "Question " + question_index;

            let question_question = clone.querySelector(".question_question");
            question_question.innerHTML = this.questions[question_index].question;

            let answer_labels = clone.querySelectorAll(".question_answer");
            for (let answer_iterator = 0; answer_iterator < answer_labels.length; answer_iterator++) {
                clone.getElementById("qn" + answer_iterator).setAttribute("name", "question_" + question_index);
                answer_labels[answer_iterator].innerHTML = this.questions[question_index].answers[answer_iterator];
            }

            document.body.appendChild(clone);
        };
    };

    // function that creates and manages the timer
    start_timer = function(time_over) {
        console.log("Starting timer.")

        let total_time = this.time;

        let minutes = Math.floor(total_time/60);
        let seconds = total_time%60;
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        console.log("Remaining time: " + minutes + ":" + seconds);

        let timer = document.getElementById("timer");
        timer.innerHTML = minutes +":" + seconds;

        timer.classList.remove("hidden");

        let timer_interval = setInterval(function() {
            total_time--;
            minutes = Math.floor(total_time/60);
            seconds = total_time%60;
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            console.log("Remaining time: " + minutes + ":" + seconds);

            timer = document.getElementById("timer");
            timer.innerHTML = minutes +":" + seconds;

            if (total_time <= 0) {
                time_over(timer_interval);
            }
        }, 1000)
    }

    // function that executes when the time runs out
    time_over = function(timer_interval) {
        alert("Time over!");

        // checks answers
        let selected_value = null;
        let correct_answers = 0;
        for (let question_iterator = 1; question_iterator <= Object.keys(this.questions).length; question_iterator++) {
            let radios = document.querySelectorAll("input[name=question_" + question_iterator + "]"); 
            console.log("Question: " + question_iterator)
            console.log(radios);
            selected_value = null;
            for (let radio_iterator = 0; radio_iterator < radios.length; radio_iterator++) {
                console.log(radios[radio_iterator])
                if (radios[radio_iterator].checked) {
                    console.log(radios[radio_iterator] + " was checked");
                    selected_value = radios[radio_iterator].value;
                }
            }

            console.log("Selected:" + selected_value + " for question number " + question_iterator)
            correct_answers += (selected_value == this.questions[question_iterator].correct_answer);
        }
        console.log("Correct answers: " + correct_answers + "/" + Object.keys(this.questions).length);

        // ends the timer
        clearInterval(timer_interval);
    };
};

let questions = {
    1: {
        question: "Question 1?",
        answers: {
            0: "Answer A",
            1: "Answer B",
            2: "Answer C",
            3: "Answer D",
        },
        correct_answer: "a",
    },
    2: {
        question: "Question 2?",
        answers: {
            0: "Answer A",
            1: "Answer B",
            2: "Answer C",
            3: "Answer D",
        },
        correct_answer: "b",
    },
};
let time = 0.1*60;

const _test = new test(time, questions);


// main function that runs when the test is started
let start_test = function() {
    console.log("Starting test.")

    _test.generate;

    _test.timer;
};

document.getElementById("start-btn").addEventListener("click", start_test);