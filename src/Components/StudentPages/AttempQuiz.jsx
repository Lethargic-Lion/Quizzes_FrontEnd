import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import '../../Css/AttemptQuiz.css'
import StudentHeader from './StudentHeader';
import Footer from '../Footer';
import Swal from 'sweetalert2';


const AttempQuiz = () => {
  const { student_id, quizID, title, timeInSeconds } = useParams();
  const student_Fname = localStorage.getItem('firstName');
  const student_Lname = localStorage.getItem('lastName');
  // console.log(student_id,quizID,title,timeInSeconds)

  const [score, setScore] = useState(0);
  const [questionData, setQuestionData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([{ selected_Option: '', fill_up_response: '' }]);

  const [inputSeconds, setInputSeconds] = useState(timeInSeconds);
  const [formattedTime, setFormattedTime] = useState('00:00:00');
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const [resultData, setResultData] = useState({
    score: score,
    quiz_id: quizID,
    name: title,
    student_id: student_id,
    student_Fname: student_Fname,
    student_Lname: student_Lname
  })

  useEffect(() => {
    console.log("score is ", score);
    setResultData((prevResultData) => ({
      ...prevResultData,
      score: score,
    }));
    console.log("result data: ", resultData)
  }, [score])

  useEffect(() => {
    const formatTime = (timeInSeconds) => {
      const hours = Math.floor(timeInSeconds / 3600);
      const minutes = Math.floor((timeInSeconds % 3600) / 60);
      const seconds = timeInSeconds % 60;
      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');

      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    };

    setFormattedTime(formatTime(inputSeconds));
    const timerId = setInterval(() => {
      if (!quizSubmitted && inputSeconds > 0) {
        setInputSeconds((prevSeconds) => prevSeconds - 1);
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [inputSeconds, quizSubmitted]);

  useEffect(() => {
    if (questionData.length === 0) {
      getQuestions();
    }
  }, []);

  const getQuestions = () => {
    let url = 'http://localhost:8080/question/getQuestionsByQuizId/' + quizID;
    axios.get(url, {
      Headers: {
        "Context-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "+",
      }
    }).then((response) => {
      console.log(questionData);
      if (response.status === 200) {
        console.log(response.data);
        setQuestionData(response.data)
        console.log(questionData)
      }
    }).catch((error) => {
      console.log(questionData)
      console.log()
      alert("Some error")
    })
  }

  const handleResponseChange = (questionId, response) => {

    console.log(response);
    setResponses(prevResponses => ({
      ...prevResponses,
      selected_Option: response,
      fill_up_response: ''
    }));
    console.log(responses)

  };

  const handleFillupResponseChange = (response) => {
    console.log(response.target.value);
    setResponses(prevResponses => ({
      ...prevResponses,
      selected_Option: '',
      fill_up_response: response.target.value
    }));
    // console.log(responses)
  }

  const displayQuestion = (question) => {
    switch (question.questionType) {
      case 'single_correct_mcq':
        return (
          <div key={question.questionId} >
            <p style={{ color: 'black', fontWeight: 'bold', fontSize: 'x-large', textAlign: 'left' }}>Q: {question.questionText}</p>
            {question.mcqOptions.map((option) => (
              <div style={{ display: 'flex', alignItems: 'start', margin: '5px' }} >
                <label key={option.optionId}>
                  <input
                    type='radio'
                    name={`${question.questionId}`}
                    value={option.optionDescription}
                    onChange={() => { handleResponseChange(question.questionId, option.optionDescription) }}
                    style={{ margin: '5px' }}
                  />
                  {option.optionDescription}
                </label>
              </div>
            ))}
            <hr />
          </div>
        );

      case 'fill_ups':
        return (
          <div key={question.questionId}>
            <p style={{ color: 'black', fontWeight: 'bold', fontSize: 'x-large', textAlign: 'left' }}>Q: {question.questionText}</p>
            <input
              placeholder='your answer here'
              type="text"
              onChange={handleFillupResponseChange}
              style={{ padding: '4px' }}
            />
            <hr />
          </div>
        );

      default:
        return null;
    }
  };

  const handleSaveAndNext = (question_id) => {
    console.log("Question Data",JSON.stringify(questionData));
    console.log("Current Question Index", currentQuestionIndex);
    console.log("Question id: ",question_id);
    const currentResponse = responses;
    const url = 'http://localhost:8080/quiz_response/addResponse/'+student_id+'/'+question_id;
    axios.post(url, currentResponse).then(() => {
      const currentQuestion = questionData[currentQuestionIndex];

      if (currentQuestion.questionType === 'single_correct_mcq') {
        const correctOption = currentQuestion.mcqOptions.find((option) => option.correct);
        if (currentResponse.selected_Option === correctOption.optionDescription) {
          setScore((prevScore) => prevScore + 1);
        }
      }

      else if (currentQuestion.questionType === 'fill_ups') {
        const correctFillText = currentQuestion.fill_up.fillText;
        if (currentResponse.fill_up_response.toLowerCase() === correctFillText.toLowerCase()) {
          setScore((prevScore) => prevScore + 1);
        }
      }
      console.log(score);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setResponses({ selected_Option: '', fill_up_response: '' });
    }).catch((error) => {
      alert("Some error occurred in posting response")
    });
  };

  const postResult = () => {
    const finalScore = score;
    // console.log("finalscore: ",finalScore);
    setResultData({
      score: finalScore,
      quiz_id: quizID,
      name: title,
      student_id: student_id,
      student_Fname: student_Fname,
      student_Lname: student_Lname
    });
    console.log('result: ', resultData);
    const url = `http://localhost:8080/result/addResult`;
    axios.post(url, resultData).then(() => {
      alert("Result posted")
    }).catch((e) => {
      alert(" Error in posting result")
    });
  }

  const handleSubmit = (question_id) => {
    const currentResponse = responses;
    console.log("Question Data",questionData);
    console.log("Current Question Index", currentQuestionIndex);
    console.log("Question id: ",question_id);
    const url = 'http://localhost:8080/quiz_response/addResponse/'+student_id+'/'+question_id;
    axios.post(url, currentResponse).then(() => {
      // console.log(currentQuestionIndex)
      // console.log(questionData.length)
      if (currentQuestionIndex === questionData.length - 1) {
        alert("Congratulations! Quiz submitted successfully");
        setQuizSubmitted(true);
      }
      const currentQuestion = questionData[currentQuestionIndex];

      if (currentQuestion.questionType === 'single_correct_mcq') {
        const correctOption = currentQuestion.mcqOptions.find((option) => option.correct);
        if (currentResponse.selected_Option === correctOption.optionDescription) {
          setScore((prevScore) => prevScore + 1);
        }
      }

      else if (currentQuestion.questionType === 'fill_ups') {
        const correctFillText = currentQuestion.fill_up.fillText;
        if (currentResponse.fill_up_response.toLowerCase() === correctFillText.toLowerCase()) {
          setScore((prevScore) => prevScore + 1);
        }
      }

      // console.log(score);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setResponses({ selected_Option: '', fill_up_response: '' });
      // console.log("Details: ", score, quizID, student_id)
      // postResult();

    }).catch((error) => {
      alert("Some error occurred in posting response", error);
    });
  }

  const restartAttempt = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setResponses([{ selected_Option: '', fill_up_response: '' }]);
    getQuestions();
  }


  return (

    <div style={{ backgroundColor: 'rgb(118 192 137)' }}>
      {<StudentHeader />}
      {currentQuestionIndex < questionData.length && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
          <p style={{ border: 'solid', marginTop: '20px', marginRight: '20px', padding: '5px' }}>Time Left: {formattedTime}</p>
        </div>
      )}


      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' , paddingTop:'90px'}}>
        <h1 style={{}}>Attempt Quiz</h1>
        {currentQuestionIndex < questionData.length && (
          <div className="container mt-2 " >
            <div className="row justify-content-center ">
              <div className="col-md-6">
                <div className="card question-card"  >
                  <div className="card-body ">
                    <div >
                      <div >{displayQuestion(questionData[currentQuestionIndex])}</div>
                      <div style={{ float: 'right' }}>
                        {currentQuestionIndex === questionData.length - 1 && <button className="btn btn-primary" onClick={()=>handleSubmit(questionData[currentQuestionIndex].questionId)}>Submit</button>}
                        {currentQuestionIndex < questionData.length - 1 && <button className="btn btn-primary" onClick={()=>handleSaveAndNext(questionData[currentQuestionIndex].questionId)}>Save and Next</button>}
                        {/* <button className="btn btn-primary" onClick={handleSaveAndNext}>{currentQuestionIndex === questionData.length - 1 ? "Submit Quiz" : "Save and Next"}</button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {currentQuestionIndex === questionData.length && (
        <div className="final-results">
          <h1>Final Results</h1>
          <h2>
            {score} out of {questionData.length} correct - ({Math.round((score / questionData.length) * 100)}%)
          </h2>
          <button className="btn btn-primary" onClick={() => restartAttempt()}>Restart Attempt</button>
          <button className="btn btn-warning" onClick={() => postResult()}>Post Result</button>
        </div>
      )}

      {/* {currentQuestionIndex === questionData.length && postResult()} */}

      <div style={{ marginTop: '40px' }}>
        <Footer />
      </div>
    </div >



  )
}

export default AttempQuiz