const ul_data = document.getElementById('ul_data'),
      form_answers = document.getElementById('form_answers'),
      btn_next = document.getElementById('btn_next'),
      restart = document.getElementById('restart');

var result,
    xhr = new XMLHttpRequest,
    question_number,
    correct_answer = '',
    total_questions,
    total_correct_answers = 0,
    rest_url,   
    category_li = document.getElementById('category_li'),
    difficulty_li = document.getElementById('difficulty_li'),
    question_li = document.getElementById('question_li'),
    progress = 0;

/* Create url with all parameters for rest request */    
function create_rest_url() {
  let current_url = window.location.href;
  let params = current_url.split('?')[1];
  let url = new URL(current_url);
  total_questions = url.searchParams.get("amount");
  rest_url = `https://opentdb.com/api.php?${params}`;
}

/* Clear html node from all children */
function removeAllChildrenFromNode(node){
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

/* Main function, collect all required data with XMLHttpRequest and create html result */
function getDataFromApi(){
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
          result = xhr.response.results[0];
          correct_answer = result.correct_answer;
          createHtmlForQuestions(result);
          createHtmlForAnswers(result);
          document.getElementById('question_number').innerHTML = `${question_number}/${total_questions}`;
      }
      if (xhr.status == 500) {
          console.log("serverfel");
      }
    }
  }
  xhr.open("GET", rest_url);
  xhr.responseType = "json";
  xhr.send();
}

/* Create html element */
function createNode(element, id){
    let tag = document.createElement(element);
    if(element == 'li'){
      tag.classList.add('list-group-item');
      tag.classList.add('list-group-item-info');
    }
    if(id !== ''){
        tag.setAttribute('id', id);
    }
    return tag;
}

/* Add element to node */
function appendElement(parent, element){
  return parent.appendChild(element);
}

/* Create html for questions */
function createHtmlForQuestions(result){
  category_li.innerHTML = `Category: ${result.category}`;  
  difficulty_li.innerHTML = `Difficulty: ${result.difficulty}`;    
  question_li.innerHTML = `${result.question}`;  
}

/* Create html for answers */
function createHtmlForAnswers(result){
  removeAllChildrenFromNode(form_answers);
  let answers = result.incorrect_answers;
  answers.push(result.correct_answer);
  answers.sort();
  let i = 1;
  answers.forEach(function(entry) {
    let answer_block = createNode('li', '');
    let label = createNode('label', '');
    label.setAttribute('for', 'id'+i);
    label.addEventListener('click', () => {
      btn_next.disabled = false;
    });
    appendElement(answer_block, label);
    let answer = createNode('input', '');
    answer.setAttribute('id', 'id'+i);
    answer.setAttribute('type', 'radio');
    answer.setAttribute('name', 'answers');
    answer.value = entry;   
    appendElement(label, answer);    
    let answer_text = createNode('span', '');
    answer_text.innerHTML = entry;  
    appendElement(label, answer_text);   
    appendElement(form_answers, answer_block);  
    i++;
  });
}

/* Initialize */
function start() {
  create_rest_url();
  getDataFromApi();
  question_number = 1;
  btn_next.disabled = true;
}

/* Go to next question, or show result if last question is done */
function next() {
  btn_next.disabled = true;
  if(question_number < total_questions){
    getDataFromApi();
    let answers = document.getElementsByName('answers');
    answers.forEach(function(answer) {
      if(answer.checked){
        if(checkAnswer(answer.value)){
          total_correct_answers++;
        }
      }
    });
    question_number++;
  } else{
    removeAllChildrenFromNode(ul_data);
    removeAllChildrenFromNode(form_answers);
    btn_next.style.display = 'none';
    let result = createNode('h1', 'result');
    result.style.color = 'white';
    result.innerHTML = `Result: ${total_correct_answers}/${total_questions}`;   
    appendElement(form_answers, result);
    result.style.textAlign = 'center';
    restart.style.display = 'block';
    restart.style.margin = '10px auto';
  }
  show_progress();
}

/* Checking  of chosen answer, blink with red or green */
function checkAnswer(answer){
  let question_number = document.getElementById('question_number');    
  if(answer === correct_answer){
    question_number.style.backgroundColor = '#8CE2A0';
    setTimeout(function(){
      question_number.style.backgroundColor = '#9AAEF1';
    }, 500);
    return true;
  } 
  question_number.style.backgroundColor = '#FF9999';
  setTimeout(function(){
    question_number.style.backgroundColor = '#9AAEF1';
  }, 500);
  return false;
}

/* Enable next button */
start(function(){
  enableNextButton();  
});

/* Progress bar */
function show_progress(){
  let progress_line = document.getElementById('progress_line');
  if(progress < 100){
    progress += 100 / total_questions;
    progress_line.style.width = Math.round(progress) + '%';
    progress_line.innerHTML = Math.round(progress) + '%';    
  }
}

/* Reserv place for possible questions and answers in parent ul and form */
function responsive(x) {
  li_height = question_li.clientHeight;  
  if (x.matches) { // If media query matches
    //mobile
    ul_data.style.minHeight = li_height * 2 + 'px';
    form_answers.style.minHeight = li_height * 5 + 'px';
  } else {

    ul_data.style.minHeight = li_height * 4 + 'px';
    form_answers.style.minHeight = li_height * 5 + 'px';
  }
}
var x = window.matchMedia("(max-width: 800px)")
responsive(x) // Call listener function at run time
x.addListener(responsive) // Attach listener function on state changes