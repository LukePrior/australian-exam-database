# australian-exam-database

https://educationstandards.nsw.edu.au/wps/portal/nesa/11-12/hsc/about-HSC/HSC-facts-figures/HSC-course-enrolments/

https://educationstandards.nsw.edu.au/wps/portal/nesa/11-12/resources/hsc-exam-papers

https://quiz.nesa.nsw.edu.au/home

HTML

```
<div style="display:flex;justify-content:center;align-items:center;gap:0.5em;">
  <input type="button" id="newQuestion" value="Skip"/>
  <input type="button" id="playButton" value="Play/Pause"/>
  <span style="font-size: 1.2em">A</span><input type="range" min="1.2" max="2.6" step=".2" value="1.2" id="slider" /><span style="font-size: 2em">A</span>
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

//TTS
$('#playButton').on('click', function(){
  if ('speechSynthesis' in window) {
    if (speechSynthesis.paused || speechSynthesis.speaking) {
      speechSynthesis.cancel();
    } else {
      var text = $("#question").html();

      text = text.replace(/<br>|<tr>/g, "\n");
      text = text.replace(/<\/td>|<\/th>/g, ".\n");
      text = text.replace(/<img.*?alt="(.*?)"[^\>]*>/g, '$1.');
      console.log(text);

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

//Get questions
var questions = [];
$.getJSON('https://raw.githubusercontent.com/LukePrior/australian-exam-database/main/exams/HSC/Economics/multiplechoice.json?token=AFLTJ5VIKGBXGVMIPPY5GP3BTSUMC', function(data) {
  questions = data;
});

var num;

// Next question
function nextQuestion(){
  num = Math.floor(Math.random() * (119));
  $("#question").html(questions[num].question);
  $("#answer1").html(questions[num].options[0]);
  $("#answer2").html(questions[num].options[1]);
  $("#answer3").html(questions[num].options[2]);
  $("#answer4").html(questions[num].options[3]);
}

//skip question
$('#newQuestion').on('click', function(){
  nextQuestion();
});

// Check answer
$('button').on('click', function(evt) {
  for (var i = 0; i < questions[num].answer.length; i++) {
    switch (questions[num].answer[i]) {
      case 0:
        if ($(this).attr("id") == "answer1") {
          nextQuestion();
        }
        break;
      case 1:
        if ($(this).attr("id") == "answer2") {
          nextQuestion();
        }
        break;
      case 2:
        if ($(this).attr("id") == "answer3") {
          nextQuestion();
        }
        break;
      case 3:
        if ($(this).attr("id") == "answer4") {
          nextQuestion();
        }
        break;
    }
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
