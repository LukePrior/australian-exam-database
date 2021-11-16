# australian-exam-database

https://educationstandards.nsw.edu.au/wps/portal/nesa/11-12/hsc/about-HSC/HSC-facts-figures/HSC-course-enrolments/

https://educationstandards.nsw.edu.au/wps/portal/nesa/11-12/resources/hsc-exam-papers

https://quiz.nesa.nsw.edu.au/home

```
<style>
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 10px;
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
</style>
```

```
<!DOCTYPE html>
<html>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <body>
    <input type="button" id="playButton" value="Play"/>
    <input type="button" id="pauseButton" value="Pause"/>
    <input type="button" id="resumeButton" value="Resume"/>
    <input type="button" id="stopButton" value="Stop"/>
    <br><br>
    Text Size: <input type="range" min="1.2" max="2.6" step=".2" id="slider" /><br><br>
    <div id="question">
      The table shows hypothetical data for the Australian economy over a two-year period.<br/><br/><table><tr><th></th><th>Year 1</th><th>Year 2</th></tr><tr><td>Consumer price index (CPI)</td><td>100</td><td>103</td></tr><tr><td>Employed persons ('000)</td><td>1800</td><td>2000</td></tr><tr><td>Unemployed persons ('000)</td><td>200</td><td>125</td></tr><tr><td>Population ('000)</td><td>2008</td><td>2095</td></tr></table><br/>Which row of the table below best accounts for the changes in CPI and unemployment rate from Year 1 to Year 2?<br/><br/><table><tr><th></th><th>Reason for change in CPI</th><th>Reason for change in unemployment rate</th></tr><tr><td>A</td><td>Reduction in the cash rate</td><td>Removal of government initiatives for education and training</td></tr><tr><td>B</td><td>Appreciation of the Australian dollar</td><td>Increase in domestic investment</td></tr><tr><td>C</td><td>Increase in import tariffs</td><td>Global economic downturn</td></tr><tr><td>D</td><td>Increase in consumer confidence</td><td>An appreciation in the currency of a major trading partner</td></tr></table>
    </div>
  </body>
  <script>
    // Text size
    $('input').on('input', function() {
      var v = $(this).val();
      $('#question').css('font-size', v + 'em')
    });
    
    //TTS
    if ('speechSynthesis' in window) {
    	var utterance = new SpeechSynthesisUtterance();
    	utterance.lang = 'en-AU';
    	utterance.rate = 0.8;
    }
    
    document.getElementById('playButton').onclick = function(){
    	var text = document.getElementById('question').innerHTML;
      
      text = text.replace(/<br>/g, "\n");
      text = text.replace(/<table>/g, "");
      text = text.replace(/<tr>/g, "\n");
      text = text.replace(/<\/td>/g, ".\n");
      text = text.replace(/<\/th>/g, ".\n");
      text = text.replace(/<\/tr>/g, "");
      text = text.replace(/<td>/g, "");
      text = text.replace(/<th>/g, "");
      text = text.replace(/<tbody>/g, "");
      text = text.replace(/<\/tbody>/g, "");
      text = text.replace(/<\/table>/g, "");
      utterance = new SpeechSynthesisUtterance();
      utterance.text = text;
      speechSynthesis.speak(utterance);
    }
    
    document.getElementById('pauseButton').onclick = function(){
        if (speechSynthesis) {
          speechSynthesis.pause();
        }
    };

    document.getElementById('resumeButton').onclick = function(){
        if (speechSynthesis) {
          speechSynthesis.resume();
        }
    };

    document.getElementById('stopButton').onclick = function(){
        if (speechSynthesis) {
          speechSynthesis.cancel();
        }
    };
    
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
  </style>
</html>
```
