# australian-exam-database

https://educationstandards.nsw.edu.au/wps/portal/nesa/11-12/hsc/about-HSC/HSC-facts-figures/HSC-course-enrolments/

https://educationstandards.nsw.edu.au/wps/portal/nesa/11-12/resources/hsc-exam-papers

https://quiz.nesa.nsw.edu.au/home

```
<!DOCTYPE html>
<html>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <body>
  	<input type="button" id="newQuestion" value="Next Q"/>
    <input type="button" id="playButton" value="Play/Pause"/>
    <br><br>
    Text Size: <input type="range" min="1.2" max="2.6" step=".2" value="1.2" id="slider" /><br><br>
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
  </body>
  <script>
    // Text size
    $('input').on('input', function() {
      var v = $(this).val();
      $('.question').css('font-size', v + 'em')
      $('.button').css('font-size', v + 'em')
    });
    
    //TTS
    document.getElementById('playButton').onclick = function(){
    	if ('speechSynthesis' in window) {
          if (speechSynthesis.paused || speechSynthesis.speaking) {
          	speechSynthesis.cancel();
          } else {
            var text = document.getElementById('question').innerHTML;

            text = text.replace(/<br>/g, "\n");
            text = text.replace(/<tr>/g, "\n");
            text = text.replace(/<\/td>/g, ".\n");
            text = text.replace(/<\/th>/g, ".\n");
            text = text.replace(/<img.*?alt="(.*?)"[^\>]*>/g, '$1.');
            
            text += "\n";
            text += [document.getElementById('answer1').textContent, document.getElementById('answer2').textContent, document.getElementById('answer3').textContent, document.getElementById('answer4').textContent].join("\n");

            utterance = new SpeechSynthesisUtterance();
            utterance.lang = 'en-AU';
    		utterance.rate = 0.7;
            utterance.text = text;
            speechSynthesis.speak(utterance);
        }
      }
    }
    
    //Get questions
    var questions = []
    $.getJSON('https://raw.githubusercontent.com/LukePrior/australian-exam-database/main/exams/HSC/Economics/multiplechoice.json?token=AFLTJ5VIKGBXGVMIPPY5GP3BTSUMC', function(data) {
      questions = data;
    });
    
    // Next question
    document.getElementById('newQuestion').onclick = function(){
      num = Math.floor(Math.random() * (119));
      document.getElementById('question').innerHTML = questions[num]["question"];
      document.getElementById('answer1').innerHTML = questions[num]["options"][0];
      document.getElementById('answer2').innerHTML = questions[num]["options"][1];
      document.getElementById('answer3').innerHTML = questions[num]["options"][2];
      document.getElementById('answer4').innerHTML = questions[num]["options"][3];
      document.getElementById('answer1').classList.remove("correct");
      document.getElementById('answer2').classList.remove("correct");
      document.getElementById('answer3').classList.remove("correct");
      document.getElementById('answer4').classList.remove("correct");
      for (var i = 0; i < questions[num]["answer"].length; i++) {
          switch (questions[num]["answer"][i]) {
          	case 0:
              document.getElementById('answer1').classList.add("correct");
              break;
            case 1:
              document.getElementById('answer2').classList.add("correct");
              break;
            case 2:
              document.getElementById('answer3').classList.add("correct");
              break;
            case 3:
              document.getElementById('answer4').classList.add("correct");
              break;
          }
      }
    };
    
    // Select answer
    $('button').on('click', function(evt) {
      if ($(this).attr("class").includes("correct")) {
      	alert("corect");
      }
    });

    
  </script>
  <style>
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
  </style>
</html>
```
