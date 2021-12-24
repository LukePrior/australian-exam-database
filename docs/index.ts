interface completed { [id: string]: {status: string, num: number} }
interface question { id: string, topic: string, content: string, outcomes: string[], year: string, source: string, number: string, marks: string, question:string, options: string[], answer: number[] }
interface topichash { [topic: string]: number }
interface modalContent { type: string, title: string, content: string }

// Initial vars
var completed: completed = {};
var questions: question[] = [];
var index: number = 0;
var questionList: string[] = [];
var num: number;

const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

'use strict';

$(function() {
  // Text size slider
  $('input').on('input', function() {
    var v = $(this).val();
    $('.question').css('font-size', v + 'em')
    $('.button').css('font-size', v + 'em')
  });

  // Shuffle array
  function shuffleArray(array: any[]) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  // Get questions
  $.getJSON('https://raw.githubusercontent.com/LukePrior/australian-exam-database/main/exams/HSC/Economics/multiplechoice.json', function(data) {
    questions = data;
    generateQuestions(20);
    nextQuestion();
  });

  // List of questions
  function generateQuestions(num: number) {
    questionList = [];
    for (const question of questions){
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
    num = questions.findIndex(item => item.id === questionList[index]);

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
  function updateQuestionStatus(outcome: string) {
    if (outcome == "correct") {
      completed[questionList[index - 1]] = {
        "status": "correct",
        "num": num
      };
    } else if (outcome == "incorrect") {
      completed[questionList[index - 1]] = {
        "status": "incorrect",
        "num": num
      };
    } else {
      completed[questionList[index - 1]] = {
        "status": "skipped",
        "num": num
      };
    }
    var content: modalContent = {} as modalContent;
    content.title = "Question: " + num + " " + completed[questionList[index - 1]].status;
    content.type = "status";
    content.content = "";
    showModal(content);
  }

  // Calculate final score
  function calculateFinalScore() {
    var correct: string[] = [];
    var incorrect: string[] = [];
    var skipped: string[] = [];
    var incorrectTopics: string[] = [];
    var correctTopics: string[] = [];
    var allTopics: string[] = [];

    for (const [key, value] of Object.entries(completed)) {
      var content = questions[value.num].content;
      if (value.status == "correct") {
        correct.push(key);
        correctTopics.push(content);
        allTopics.push(content);
      } else if (value.status == "incorrect") {
        incorrect.push(key);
        incorrectTopics.push(content);
        allTopics.push(content);
      } else {
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
  function calculateStrengths (correctTopics: string[], incorrectTopics: string[]) {
    // Strengths
    var correctHash: topichash = {}
    var topicStrengths: [string, number][] = [];
    var topicStrengthsFinal: string[] = [];

    for (var i = correctTopics.length; i >= 0; i--) {
      if (incorrectTopics.includes(correctTopics[i])) {
        correctTopics.splice(i, 1);
      }
    }

    for (const item of correctTopics) {
      if (!correctHash[item]) correctHash[item] = 0
      correctHash[item]++
    }

    // Only keep correct answers above 1
    for (const [key, value] of Object.entries(correctHash)) {
      if (value > 1) topicStrengths.push([key, value]);
    }

    // Orders topics best to worst
    topicStrengths.sort(function(a, b) {
      return b[1] - a[1];
    });

    // Select best 3 topics
    topicStrengthsFinal = topicStrengths.slice(0, 3).map(function(value, index) {
      return value[0];
    });
    
    return topicStrengthsFinal;
  }

  // Calculate weaknesses
  function calculateWeaknesses (allTopics: string[], incorrectTopics: string[]) {
    // Weaknesses
    var allHash: topichash = {}
    var incorrectHash: topichash = {}
    var topicWeaknesses: [string, number][] = [];
    var topicWeaknessesFinal: string[] = [];

    for (const item of allTopics) {
      if (!allHash[item]) allHash[item] = 0
      allHash[item]++
    }

    for (const item of incorrectTopics) {
      if (!incorrectHash[item]) incorrectHash[item] = 0
      incorrectHash[item]++
    }

    // Calculate percentage incorrect for each topic with > 1 entry
    for (const [key, value] of Object.entries(incorrectHash)) {
      if (value > 1) topicWeaknesses.push([key, Math.round((value / allHash[key]) * 100)]);
    }

    // Orders topics worst to best
    topicWeaknesses.sort(function(a, b) {
      return b[1] - a[1];
    });

    // Select worst 3 topics
    topicWeaknessesFinal = topicWeaknesses.slice(0, 3).map(function(value, index) {
      return value[0];
    });
    
    return topicWeaknessesFinal;
  }

  // Help button
  $('#helpButton').on('click', function() {
    var question = questions[num];
    var content: modalContent = {} as modalContent;
    content.title = "Question Information";
    content.type = "help";

    var tempContets = "Question source: " + question.year + " " + question.source;
    tempContets += "\nQuestion number: " + question.number;
    tempContets += "\nQuestion content: " + question.topic + " - " + question.content;
    tempContets += "\nQuestion oucomes: " + question.outcomes.join(", ");
    content.content = tempContets;

    showModal(content);
  });

  // Skip question
  $('#newQuestion').on('click', function() {
    updateQuestionStatus("skipped");
  });

  // Exit set
  $('#exitButton').on('click', function() {
    calculateFinalScore();
    completed = {};
  });

  // Check answer
  $('button').on('click', function() {
    var id = $(this).attr("id");
    var correct = false;
    for (const answer in questions[num].answer) {
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
  function showModal (content: modalContent) {
    $("#myModalText").text(content.content);
    $("#myModal").css("display", "block");
  }

  // Modal hide
  function hideModal () {
    $("#myModal").css("display", "none");
    // check modal type
    nextQuestion();
  }

  // Modal exit
  $(window).on('click', function( event ) {
    // @ts-ignore
    if (event.target == $("#myModal")[0]) {
      hideModal();
    }
  });

  // Modal close button
  $(".close").on('click', function( event ) { hideModal() });

  // Theme changer
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme == "dark") {
    document.body.classList.toggle("dark-theme");
  } else if (currentTheme == "light") {
    document.body.classList.toggle("light-theme");
  }

  $('#themeButton').on('click', function( event ) {
    if (prefersDarkScheme.matches) {
      document.body.classList.toggle("light-theme");
      var theme = document.body.classList.contains("light-theme")
        ? "light"
        : "dark";
    } else {
      document.body.classList.toggle("dark-theme");
      var theme = document.body.classList.contains("dark-theme")
        ? "dark"
        : "light";
    }
    localStorage.setItem("theme", theme);
  });
});