var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  // data (text strings) becomes a JavaScript object w JSON.parse
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    console.log(list, arr);
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

$(".list-group").on("click", "p", function(){
  // list-group is the parent element
  // console.log("<p> was clicked"); is same as...
  // console.log(this);
  var text = $(this) 
    .text() // clicking this returns the value of what's in the P element
    .trim(); // remove any extra white space before or after
  // var text = $(this).text().trim(); // same as above just easier to read
  var textInput = $("<textarea>")
    .addClass("form-control")
    .val(text);
  $(this).replaceWith(textInput); // swap out existing P element with new textarea
  textInput.trigger("focus");
  
});

$(".list-group").on("blur", "textarea", function(){
  // get textarea's current value/text
  var text = $(this)
    .val()
    .trim();

  // get parent ul's id attribute
  var status = $(this)
    .closest(".list-group")
    // In jQuery, attr() can serve two purposes
    // With one argument, it gets an attribute (e.g., attr("id"))
    // With two arguments, it sets an attribute (e.g., attr("type", "text")
    .attr("id")
    .replace("list-", ""); // jQuery and JavaScript operators chained together

  // get task's position in the list of other li elements
  var index = $(this)
    .closest(".list-group-item")
    .index(); // points out that child element indexes start at 0

   tasks[status][index].text = text; // tasks is an object, tasks[status] returns an array (ex: toDo)
   // tasks[status][index] returns the obj at given index in array
   // tasks[status][index].text returns the text property of the object at the given index
   saveTasks(); // save tasks immediately to LS

  // convert the <textarea> back into a <p> element
  var taskP = $("<p>")
    .addClass("m-1")
    .text(text);

  // replace textarea with p element
  $(this).replaceWith(taskP);
  
});

// due date was clicked
$(".list-group").on("click", "span", function(){
  // get current text
  var date = $(this)
    .text()
    .trim();

  // create new input el
  var dateInput = $("<input>")
  // In jQuery, attr() can serve two purposes
  // With one argument, it gets an attribute (e.g., attr("id"))
  // With two arguments, it sets an attribute (e.g., attr("type", "text")
    .attr("type", "text")
    .addClass("form-control")
    .val(date);

  // swap out el's
  $(this).replaceWith(dateInput);

  // automatically focus on new el
  dateInput.trigger("focus");
});

// value of due date was changed
$(".list-group").on("blur", "input[type='text']", function(){
  // get current text
  var date = $(this)
    .val()
    .trim();

  // get parent ul's id attribute
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");

  // get task's position in list of other li el's
  var index = $(this)
    .closest(".list-group-item")
    .index();

  // update task in array and re-save to LS
  tasks[status][index].date = date;
  saveTasks();

  // recreate span el with bootstrap classes
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(date);

  // replace input with span el
  $(this).replaceWith(taskSpan);

});  

// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();


