let test = {
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

let start_test = function() {
    console.log("Starting test.")
    for (let question_index in test) {
        console.log(question_index);
        console.log("Full question object:", test[question_index]); // Debug: see the whole object

        let template = document.getElementById("question_template");
        let clone = template.content.cloneNode(true);

        let question_form = clone.querySelector(".question_form");
        question_form.id = "question_" + question_index;

        let question_title = clone.querySelector(".question_title");
        question_title.innerHTML = "Question " + question_index;

        let question_question = clone.querySelector(".question_question");
        question_question.innerHTML = test[question_index].question;

        let answer_labels = clone.querySelectorAll(".question_answer");
        for (let answer_iterator = 0; answer_iterator < answer_labels.length; answer_iterator++) {
            answer_labels[answer_iterator].innerHTML = test[question_index].answers[answer_iterator];
        }

        document.body.appendChild(clone);
    }

    console.log("Starting timer.")

    let total_time = 0.1*60; //  6 seconds

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
       let minutes = Math.floor(total_time/60);
        let seconds = total_time%60;
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        console.log("Remaining time: " + minutes + ":" + seconds);

        timer = document.getElementById("timer");
        timer.innerHTML = minutes +":" + seconds;

        if (total_time <= 0) {
            alert("Time over!");
            clearInterval(timer_interval);
        }
    }, 1000)
};

document.getElementById("start-btn").addEventListener("click", start_test);