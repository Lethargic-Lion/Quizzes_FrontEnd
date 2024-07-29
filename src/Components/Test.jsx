import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import '../Css/AttemptQuiz.css'


const AttempQuiz = () => {
  console.log(useParams(),"test");
  const { quizID } = useParams();
  console.log("Quiz_id:",quizID);

  const [score, setScore] = useState(0);
  const [questionData, setQuestionData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([{ selected_Option: '', fill_up_response: '' }]);

  // const [currentTime, setCurrentTime] = useState(new Date())

    // useEffect(() => {
    //     const clearVariable = setInterval(() => {
    //         setCurrentTime(new Date())
    //         console.log(currentTime);
    //     }, 2000)
    //     return () => clearInterval(clearVariable);
    // },[currentTime])

  useEffect(() => {
    if (questionData.length === 0) {
      getQuestions();
    }
  }, [questionData]);

  const getQuestions = () => {
    let url = 'http://localhost:8080/question/getQuestionsByQuizId/'+quizID;
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
  }



  const displayQuestion = (question) => {
    switch (question.questionType) {
      case 'single_correct_mcq':
        return (
          <div key={question.questionId}>
            <p style={{ color: 'black', fontWeight: 'bold', fontSize: 'x-large' }}>{question.questionText}</p>
            {question.mcqOptions.map((option) => (
              <div >
                <label key={option.optionId} >
                  <input
                    type='radio'
                    name={`${question.questionId}`}
                    value={option.optionDescription}
                    onChange={() => { handleResponseChange(question.questionId, option.optionDescription) }}

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
            <p style={{ color: 'black', fontWeight: 'bold' }}>{question.questionText}</p>
            <input
              placeholder='your answer here'
              type="text"
              onChange={handleFillupResponseChange}
            />
            <hr />
          </div>
        );

      default:
        return null;
    }
  };

  const handleSaveAndNext = () => {
    const currentResponse = responses;

    const url = `http://localhost:8080/quiz_response/addResponse`;
    axios.post(url, currentResponse).then(() => {
      if (currentQuestionIndex === questionData.length) {
        alert("Congratulations! Quiz submitted successfully");

      } else {
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

        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setResponses({ selected_Option: '', fill_up_response: '' });
      }

    }).catch((error) => {
      alert("Some error occurred in posting response")
    });
  };

  const restartAttempt = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setResponses([{ selected_Option: '', fill_up_response: '' }]);
    getQuestions();
  }


  return (

    <div>

      <h1>Attempt Quiz</h1>
      {currentQuestionIndex < questionData.length && (
        <div className="container mt-4">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <div>
                      <div>{displayQuestion(questionData[currentQuestionIndex])}</div>                   
                      <div>
                        <button onClick={handleSaveAndNext}>{currentQuestionIndex === questionData.length - 1 ? "Submit Quiz" : "Save and Next"}</button>
                        <p>Current Score: {score}</p>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentQuestionIndex === questionData.length && (
        <div className="final-results">
          <h1>Final Results</h1>
          <h2>
            {score} out of {questionData.length} correct - ({(score / questionData.length) * 100}%)
          </h2>
          <button onClick={() => restartAttempt()}>Restart Attempt</button>
        </div>
      )}

    </div >
  )
}

export default AttempQuiz