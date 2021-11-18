# australian-exam-database

https://educationstandards.nsw.edu.au/wps/portal/nesa/11-12/hsc/about-HSC/HSC-facts-figures/HSC-course-enrolments/

https://educationstandards.nsw.edu.au/wps/portal/nesa/11-12/resources/hsc-exam-papers

https://quiz.nesa.nsw.edu.au/home

only keep in list if good > 2 remove if any wrong

worst by percentage

HTML

```
<div style="display:flex;justify-content:center;align-items:center;gap:0.5em;">
  <input type="button" id="newQuestion" value="Skip"/>
  <input type="button" id="helpButton" value="Help"/>
  <input type="button" id="exitButton" value="Exit"/>
  <input type="button" id="playButton" value="Play/Pause"/>
  <span style="font-size: 1.2em">A</span><input type="range" min="1.2" max="2.6" step=".2" value="1.2" id="slider" /><span style="font-size: 2em">A</span>
  <p>Question: <span id="questionCounter"></span>/<span id="questionCount"></span></p>
</div>
<br>
<div id="content">
  <div id="question" class="question">
  </div>
  <br><br>
  <div id="answers" class="answers">
    <button class="button" id="answer1"></button><br>
    <button class="button" id="answer2"></button><br>
    <button class="button" id="answer3"></button><br>
    <button class="button" id="answer4"></button><br>
  </div>
</div>
```

JS

```
// Text size slider
$('input').on('input', function() {
  var v = $(this).val();
  $('.question').css('font-size', v + 'em')
  $('.button').css('font-size', v + 'em')
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

// TTS
$('#playButton').on('click', function(){
  if ('speechSynthesis' in window) {
    if (speechSynthesis.paused || speechSynthesis.speaking) {
      speechSynthesis.cancel();
    } else {
      var text = $("#question").html();

      text = text.replace(/<br>|<tr>/g, "\n");
      text = text.replace(/<\/td>|<\/th>/g, ".\n");
      text = text.replace(/<img.*?alt="(.*?)"[^\>]*>/g, '$1.');

      text += "\n";
      text += [$("#answer1").text(), $("#answer2").text(), $("#answer3").text(), $("#answer4").text()].join("\n");

      utterance = new SpeechSynthesisUtterance();
      utterance.lang = 'en-AU';
      utterance.rate = 0.7;
      utterance.text = text;
      speechSynthesis.speak(utterance);
    }
  }
});

// Get questions
var questions = [];
$.getJSON('https://raw.githubusercontent.com/LukePrior/australian-exam-database/main/exams/HSC/Economics/multiplechoice.json?token=AFLTJ5VIKGBXGVMIPPY5GP3BTSUMC', function(data) {
  questions = data;
  generateQuestions(20);
  nextQuestion();
});

// Questions
var questionList = [];

// List of questions
function generateQuestions(num){
  questionList = [];
  for (var i = 0; i < 120; i++) {
    questionList.push(questions[i].id);
  }
  shuffleArray(questionList);
  if (generateQuestions.arguments != 0) {
  	questionList = questionList.slice(0, num);
  }
}

// Start set
var index = 0;

// Next question
var num;
function nextQuestion(){
  if (index == questionList.length) {
    // Set completed
    calculateFinalScore();
    index = 0;
    completed = {};
  }
  question = questionList[index];
  num = questions.findIndex(item => item.id === question);
  
  $("#question").html(questions[num].question);
  $("#answer1").html(questions[num].options[0]);
  $("#answer2").html(questions[num].options[1]);
  $("#answer3").html(questions[num].options[2]);
  $("#answer4").html(questions[num].options[3]);
  
  $("#questionCounter").text(index+1);
  $("#questionCount").text(questionList.length);
  
  index += 1;
}

// Update question status
var completed = {};
function updateQuestionStatus (outcome) {
	if (outcome == "correct") {
  	completed[questionList[index-1]] = "correct";
  } else if (outcome == "incorrect") {
    completed[questionList[index-1]] = "incorrect";
  } else {
  	completed[questionList[index-1]] = "skipped";
  }
  nextQuestion();
}

// Calculate final score
function calculateFinalScore () {
	var correct = [];
  var incorrect = [];
  var skipped = [];
  
  for (var question in completed) {
  	if (completed.hasOwnProperty(question)) {
    	if (completed[question] == "correct") {
      	correct.push(question);
      } else if (completed[question] == "incorrect") {
      	incorrect.push(question);
      } else {
        skipped.push(question);
      }
    }
  }
  
  var incorrectTopics = [];
  for (var i = 0; i < incorrect.length; i++) {
  	var num = questions.findIndex(item => item.id === incorrect[i]);
    incorrectTopics.push(questions[num].content);
  }
  
  var correctTopics = [];
  for (var i = 0; i < correct.length; i++) {
  	var num = questions.findIndex(item => item.id === correct[i]);
    correctTopics.push(questions[num].content);
  }

  console.log("Weaknesses: " + topKFrequent(incorrectTopics, 3).join(", "));
  console.log("Strengths: " + topKFrequent(correctTopics, 3).join(", "));
  
  alert(correct.length + "/" + (correct.length + incorrect.length) + ", " + skipped.length + " skipped");
}

// return k most common items from list
function topKFrequent(list, k) {
  let hash = {}

  for (let item of list) {
    if (!hash[item]) hash[item] = 0
    hash[item]++
  }

  const hashToArray = Object.entries(hash)
  const sortedArray = hashToArray.sort((a,b) => b[1] - a[1])
  const sortedElements = sortedArray.map(item => item[0])
  return sortedElements.slice(0, k)
}

// Help button
$('#helpButton').on('click', function(){
  var question = questions[num];
  console.log("Question source: " + question.year + " " + question.source);
  console.log("Question number: " + question.number);
  console.log("Question content: " + question.topic + " - " + question.content);
  console.log("Question oucomes: " + question.outcomes.join(", "));
});

// Skip question
$('#newQuestion').on('click', function(){
  updateQuestionStatus("skipped");
});

// Exit set
$('#exitButton').on('click', function(){
  calculateFinalScore();
});

// Check answer
$('button').on('click', function() {
  var id = $(this).attr("id");
  var correct = false;
  for (var i = 0; i < questions[num].answer.length; i++) {
    if (questions[num].answer[i] == 0 && id == "answer1" || questions[num].answer[i] == 1 && id == "answer2" || questions[num].answer[i] == 2 && id == "answer3" || questions[num].answer[i] == 3 && id == "answer4") {
      updateQuestionStatus("correct");
      correct = true;
    }
  }
  if (!correct) {
  	updateQuestionStatus("incorrect");
  }
});
```

CSS

```
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 0.625em;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}
body {
  text-align: center;
  font-family: Verdana, sans-serif;
}
img {
  max-width: 100%;
}
.question {
  font-size: 1.2em;
  transition-duration: 0.4s;
}
.button {
  border: solid;
  padding: 1em 2em;
  margin: 0.25em 0.125em;
  text-align: center;
  text-decoration: none;
  font-size: 1.2em;
  flex: 1 1 0px;
  border-width: thin;
  border-color: Gainsboro;
  transition-duration: 0.4s;
  cursor: pointer;
}
.button:hover {background-color: Gainsboro;}
.button:active {
  box-shadow: box-shadow:
    7px 6px 28px 1px rgba(0, 0, 0, 0.24);
  transform: translateY(0.25em);
}
.answers {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  flex-wrap: wrap;
}
```
