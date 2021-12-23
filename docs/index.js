// Initial vars
var completed = {};
var questions = [];
var index = 0;
var questionList = [];
var num;
var prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
'use strict';
$(function () {
    // Text size slider
    $('input').on('input', function () {
        var v = $(this).val();
        $('.question').css('font-size', v + 'em');
        $('.button').css('font-size', v + 'em');
    });
    // Shuffle array
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
    // Get questions
    $.getJSON('https://raw.githubusercontent.com/LukePrior/australian-exam-database/main/exams/HSC/Economics/multiplechoice.json', function (data) {
        questions = data;
        generateQuestions(20);
        nextQuestion();
    });
    // List of questions
    function generateQuestions(num) {
        questionList = [];
        for (var _i = 0, questions_1 = questions; _i < questions_1.length; _i++) {
            var question = questions_1[_i];
            questionList.push(question.id);
        }
        shuffleArray(questionList);
        if (generateQuestions.arguments != 0) {
            questionList = questionList.slice(0, num);
        }
    }
    // Next question
    function nextQuestion() {
        if (index == questionList.length) {
            // Set completed
            calculateFinalScore();
            index = 0;
            completed = {};
        }
        num = questions.findIndex(function (item) { return item.id === questionList[index]; });
        $("#question").html(questions[num].question);
        $("#answer1").html(questions[num].options[0]);
        $("#answer2").html(questions[num].options[1]);
        $("#answer3").html(questions[num].options[2]);
        $("#answer4").html(questions[num].options[3]);
        $("#questionCounter").text(index + 1);
        $("#questionCount").text(questionList.length);
        index += 1;
    }
    // Update question status
    function updateQuestionStatus(outcome) {
        if (outcome == "correct") {
            completed[questionList[index - 1]] = {
                "status": "correct",
                "num": num
            };
        }
        else if (outcome == "incorrect") {
            completed[questionList[index - 1]] = {
                "status": "incorrect",
                "num": num
            };
        }
        else {
            completed[questionList[index - 1]] = {
                "status": "skipped",
                "num": num
            };
        }
        showModal(completed[questionList[index - 1]]);
    }
    // Calculate final score
    function calculateFinalScore() {
        var correct = [];
        var incorrect = [];
        var skipped = [];
        var incorrectTopics = [];
        var correctTopics = [];
        var allTopics = [];
        for (var _i = 0, _a = Object.entries(completed); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            var content = questions[value.num].content;
            if (value.status == "correct") {
                correct.push(key);
                correctTopics.push(content);
                allTopics.push(content);
            }
            else if (value.status == "incorrect") {
                incorrect.push(key);
                incorrectTopics.push(content);
                allTopics.push(content);
            }
            else {
                skipped.push(key);
            }
        }
        var topicStrengths = calculateStrengths(correctTopics, incorrectTopics);
        var topicWeaknesses = calculateWeaknesses(allTopics, incorrectTopics);
        console.log("Strengths: " + topicStrengths.join(", "));
        console.log("Weaknesses: " + topicWeaknesses.join(", "));
        alert(correct.length + "/" + (correct.length + incorrect.length) + ", " + skipped.length + " skipped");
    }
    // Calculate strengths
    function calculateStrengths(correctTopics, incorrectTopics) {
        // Strengths
        var correctHash = {};
        var topicStrengths = [];
        var topicStrengthsFinal = [];
        for (var i = correctTopics.length; i >= 0; i--) {
            if (incorrectTopics.includes(correctTopics[i])) {
                correctTopics.splice(i, 1);
            }
        }
        for (var _i = 0, correctTopics_1 = correctTopics; _i < correctTopics_1.length; _i++) {
            var item = correctTopics_1[_i];
            if (!correctHash[item])
                correctHash[item] = 0;
            correctHash[item]++;
        }
        // Only keep correct answers above 1
        for (var _a = 0, _b = Object.entries(correctHash); _a < _b.length; _a++) {
            var _c = _b[_a], key = _c[0], value = _c[1];
            if (value > 1)
                topicStrengths.push([key, value]);
        }
        // Orders topics best to worst
        topicStrengths.sort(function (a, b) {
            return b[1] - a[1];
        });
        // Select best 3 topics
        topicStrengthsFinal = topicStrengths.slice(0, 3).map(function (value, index) {
            return value[0];
        });
        return topicStrengthsFinal;
    }
    // Calculate weaknesses
    function calculateWeaknesses(allTopics, incorrectTopics) {
        // Weaknesses
        var allHash = {};
        var incorrectHash = {};
        var topicWeaknesses = [];
        var topicWeaknessesFinal = [];
        for (var _i = 0, allTopics_1 = allTopics; _i < allTopics_1.length; _i++) {
            var item = allTopics_1[_i];
            if (!allHash[item])
                allHash[item] = 0;
            allHash[item]++;
        }
        for (var _a = 0, incorrectTopics_1 = incorrectTopics; _a < incorrectTopics_1.length; _a++) {
            var item = incorrectTopics_1[_a];
            if (!incorrectHash[item])
                incorrectHash[item] = 0;
            incorrectHash[item]++;
        }
        // Calculate percentage incorrect for each topic with > 1 entry
        for (var _b = 0, _c = Object.entries(incorrectHash); _b < _c.length; _b++) {
            var _d = _c[_b], key = _d[0], value = _d[1];
            if (value > 1)
                topicWeaknesses.push([key, Math.round((value / allHash[key]) * 100)]);
        }
        // Orders topics worst to best
        topicWeaknesses.sort(function (a, b) {
            return b[1] - a[1];
        });
        // Select worst 3 topics
        topicWeaknessesFinal = topicWeaknesses.slice(0, 3).map(function (value, index) {
            return value[0];
        });
        return topicWeaknessesFinal;
    }
    // Help button
    $('#helpButton').on('click', function () {
        var question = questions[num];
        console.log("Question source: " + question.year + " " + question.source);
        console.log("Question number: " + question.number);
        console.log("Question content: " + question.topic + " - " + question.content);
        console.log("Question oucomes: " + question.outcomes.join(", "));
    });
    // Skip question
    $('#newQuestion').on('click', function () {
        updateQuestionStatus("skipped");
    });
    // Exit set
    $('#exitButton').on('click', function () {
        calculateFinalScore();
        completed = {};
    });
    // Check answer
    $('button').on('click', function () {
        var id = $(this).attr("id");
        var correct = false;
        for (var answer in questions[num].answer) {
            if (questions[num].answer[answer] == 0 && id == "answer1" || questions[num].answer[answer] == 1 && id == "answer2" || questions[num].answer[answer] == 2 && id == "answer3" || questions[num].answer[answer] == 3 && id == "answer4") {
                updateQuestionStatus("correct");
                correct = true;
            }
        }
        if (!correct) {
            updateQuestionStatus("incorrect");
        }
    });
    // Modal show
    function showModal(completed) {
        console.log(completed.status);
        console.log(questions[completed.num]);
        $("#myModal").css("display", "block");
    }
    // Modal hide
    function hideModal() {
        $("#myModal").css("display", "none");
        nextQuestion();
    }
    // Modal exit
    $(window).on('click', function (event) {
        // @ts-ignore
        if (event.target == $("#myModal")[0]) {
            hideModal();
        }
    });
    // Modal close button
    $(".close").on('click', function (event) { hideModal(); });
    // Theme changer
    var currentTheme = localStorage.getItem("theme");
    if (currentTheme == "dark") {
        document.body.classList.toggle("dark-theme");
    }
    else if (currentTheme == "light") {
        document.body.classList.toggle("light-theme");
    }
    $('#themeButton').on('click', function (event) {
        if (prefersDarkScheme.matches) {
            document.body.classList.toggle("light-theme");
            var theme = document.body.classList.contains("light-theme")
                ? "light"
                : "dark";
        }
        else {
            document.body.classList.toggle("dark-theme");
            var theme = document.body.classList.contains("dark-theme")
                ? "dark"
                : "light";
        }
        localStorage.setItem("theme", theme);
    });
});