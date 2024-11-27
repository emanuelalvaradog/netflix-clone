var courses = ["156"]; //
var rows = [];
var quizzes = [];
var responseRows = [];

function responseToRows(requestedFields, response) {
  // Transform parsed data and filter for requested fields
  return response.map(function (submission) {
    var row = [];
    requestedFields.asArray().forEach(function (field) {
      switch (field.getId()) {
        case "userId":
          return row.push(submission.userId);
        case "userName":
          return row.push(submission.userName);

        case "courseName":
          return row.push(submission.courseName);

        case "courseId":
          return row.push(submission.courseId);

        case "activity":
          return row.push(submission.activity);
        case "grade":
          return row.push(submission.grade);
        case "quizId":
          return row.push(submission.quizId);
        case "questionId":
          return row.push(submission.questionId);
        case "answerId":
          return row.push(submission.answerId);
        case "answerText":
          return row.push(submission.answerText);
        case "questionName":
          return row.push(submission.questionName);
        case "questionText":
          return row.push(submission.questionText);
        // case 'u_email':
        //   return row.push(submission.u_email);
        // case 'admins':
        //   return row.push(admin.role_id);
        default:
          return row.push("");
      }
    });
    return { values: row };
  });
}

function createEntry(user, submission) {
  // console.log(submission.assignment);

  if (submission.assignment.quiz_id != undefined) {
    // console.log(submission.assignment.quiz_id);
    if (!quizzes.includes(submission.assignment.quiz_id))
      quizzes.push(submission.assignment.quiz_id);

    var entryArr = [];

    if (submission.submission_history[0].submission_data) {
      submission.submission_history[0].submission_data.forEach((answer) => {
        var entry = {
          userId: user.user_id,
          userName: submission.user.name,
          courseName: submission.course.name,
          courseId: submission.course.id,
          activity: submission.assignment.name,
          grade: submission.entered_score,
          // submissionData: submission.submission_history[0].submission_data,
          quizId: submission.assignment.quiz_id,
          questionId: answer.question_id,
          answerId: answer.answer_id,
          answerText: answer.text,
        };

        entryArr.push(entry);
      });
      return entryArr;
    }
  }
  return undefined;
}
async function getData() {
  var courses = ["156"]; //
  var rows = [];
  var quizzes = [];
  var responseRows = [];

  function createEntry(user, submission) {
    // console.log(submission.assignment);

    if (submission.assignment.quiz_id != undefined) {
      // console.log(submission.assignment.quiz_id);
      if (!quizzes.includes(submission.assignment.quiz_id))
        quizzes.push(submission.assignment.quiz_id);

      var entryArr = [];

      if (submission.submission_history[0].submission_data) {
        submission.submission_history[0].submission_data.forEach((answer) => {
          var entry = {
            userId: user.user_id,
            userName: submission.user.name,
            courseName: submission.course.name,
            courseId: submission.course.id,
            activity: submission.assignment.name,
            grade: submission.entered_score,
            // submissionData: submission.submission_history[0].submission_data,
            quizId: submission.assignment.quiz_id,
            questionId: answer.question_id,
            answerId: answer.answer_id,
            answerText: answer.text,
          };

          entryArr.push(entry);
        });
        return entryArr;
      }
    }
    return undefined;
  }

  // Fetch and parse data from API
  var urlCourses =
    `https://datarebels.instructure.com/api/v1/courses/${courses[0]}/students/submissions` +
    "?access_token=22862~lyqEdpG8EDE7sFfNGI9HdPZOyn0Jus9cwfIqQ6VRLTZU77L1JsR2Oq2DuZEaFeKp" +
    "&student_ids[]=all" +
    "&grouped=true" +
    "&include[]=user" +
    "&include[]=assignment" +
    "&include[]=course" +
    "&include[]=submission_history" +
    "&per_page=500";

  var courseResponse = await fetch(urlCourses);
  var parsedCourseResponse = await JSON.parse(courseResponse);

  parsedCourseResponse.forEach((user) => {
    user.submissions.forEach((submission) => {
      var entryArr = createEntry(user, submission);
      if (entryArr != undefined) {
        // rows.push(entry);
        responseRows = responseRows.concat(entryArr);
      }
    });
  });

  function createQuestionEntry(question) {
    const questionEntry = {
      quizId: question.quiz_id,
      questionId: question.id,
      questionName: question.question_name,
      questionText: question.question_text,
    };
    return questionEntry;
  }

  var quizzesDataset = [];

  quizzes.forEach(async (quiz, idx) => {
    // console.log(quiz, ' idx:', idx);

    var urlQuestions =
      `https://datarebels.instructure.com/api/v1/courses/${courses[0]}/quizzes/${quiz}/questions` +
      "?access_token=22862~lyqEdpG8EDE7sFfNGI9HdPZOyn0Jus9cwfIqQ6VRLTZU77L1JsR2Oq2DuZEaFeKp" +
      "&student_ids[]=all" +
      "&grouped=true" +
      "&include[]=user" +
      "&include[]=assignment" +
      "&include[]=course" +
      "&include[]=submission_history" +
      "&per_page=500";

    var quizResponse = await fetch(urlQuestions);
    var parsedQuizResponse = await JSON.parse(quizResponse);

    var questionEntries = [];
    parsedQuizResponse.forEach((question) => {
      var questionEntry = createQuestionEntry(question);
      questionEntries.push(questionEntry);
    });

    quizzesDataset = quizzesDataset.concat(questionEntries);
  });

  var results = [];
  responseRows.forEach(function (answer) {
    var quizObj = quizzesDataset.find((i) => i.questionId == answer.questionId);
    var rowAug = {
      ...answer,
      questionName: quizObj.questionName,
      questionText: quizObj.questionText,
    };
    results.push(rowAug);
  });

  rows = responseToRows(requestedFields, results);

  console.log(rows);

  // var responsePromise = new Promise((resolve, reject) => {
  // if (index === array.length -1) resolve();
  // });

  // responsePromise.then(() => {
  //   Logger.log(responseRows);
  // });
}

getData();
