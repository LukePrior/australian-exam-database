var questionsIndex;

'use strict';

// Get question index

function getQuestionIndex () {
    var questionData;

    $.getJSON('https://raw.githubusercontent.com/LukePrior/australian-exam-database/main/exams/questions.json', function(data){
        questionData = data;
    });

    return questionData
}

// Page loaded

$( document ).ready(function() {
    questionsIndex = getQuestionIndex();
    console.log(questionsIndex);
});