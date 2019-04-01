var start_btn = document.getElementById('start_btn'),
    category_select = document.getElementById('category_select'),
    difficulty_select = document.getElementById('difficulty_select');

/* Get all parameters and redirect to quiz page ('quiz.html') */
start_btn.addEventListener('click', function() {
	let amount, category, difficulty, type, my_path, filename, quiz_url;

	amount = document.getElementById('amount_input').value;
	category = category_select.options[category_select.selectedIndex].value;
	difficulty = difficulty_select.options[difficulty_select.selectedIndex].value;
	type = type_select.options[type_select.selectedIndex].value;
	my_path = window.location.pathname;
	filename = my_path.replace(/^.*[\\\/]/, '');
	
	/* Create url with all needed parameters */
	quiz_url = my_path.replace(filename, 'quiz.html') + `?amount=${amount}&difficulty=${difficulty}`;
	if(category !== 'any'){
		quiz_url += `&category=${category}`;
	}
	if(type !== 'any'){
		quiz_url += `&type=${type}`;
	}
	
	/* Redirect */
	window.location.href = quiz_url;
})