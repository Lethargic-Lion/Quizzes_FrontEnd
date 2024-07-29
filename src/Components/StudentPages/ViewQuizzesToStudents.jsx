import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import StudentHeader from './StudentHeader';
import Footer from '../Footer';

const ViewQuizzesToStudents = () => {
    const { student_id } = useParams();
    // console.log("Student id is: ",student_id);
    const [attempted, setAttempted] = useState(false);
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        displayQuizzes();

    }, [])

    const displayQuizzes = () => {
        let url = 'http://localhost:8080/quiz/getAllQuiz';
        axios.get(url, {
            Headers: {
                "Context-Type": "application/json",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "+",
            }
        }).then((response) => {
            if (response.status === 200) {
                console.log(response.data);
                setQuizzes(response.data)
                console.log(quizzes)
            }
        }).catch(error => {
            alert("Some error displaying all the quizzes")
        })
    }

    const convert12HourTo24Hour = (time12Hour) => {
        const [time, period] = time12Hour.split(' ');
        let [hours, minutes, seconds] = time.split(':');

        if (period === 'PM' && hours !== '12') {
            hours = String(Number(hours) + 12);
        } else if (period === 'AM' && hours === '12') {
            hours = '00';
        }

        return `${hours}:${minutes}:${seconds}`;
    };

    // const [quizID,setQuizID] = useState();
    // console.log(attempted);
    const checkForQuizAvailability = (quiz_id, title, timer, start_time, end_time, quiz_date) => {
        const currentTime = new Date();
        const currentFormattedTime = currentTime.toLocaleTimeString();
        const timeIn24HoursFormat = convert12HourTo24Hour(currentFormattedTime);

        // setQuizID(quiz_id);

        const inputDateObj = new Date(quiz_date + "T00:00:00");
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        // console.log("Attempted: ",attempted);
        const url = 'http://localhost:8080/result/checkResult/'+localStorage.getItem("student_id")+'/'+quiz_id
        axios.get(url).then((response) => {
            console.log('Response: ', response.data);
            if (response.data) {
                alert("You Have Already Attempted the Quiz");
            }
            else if (start_time <= timeIn24HoursFormat && timeIn24HoursFormat <= end_time && inputDateObj.getTime() === currentDate.getTime()) {
                navigate(`/attemptQuiz/${student_id}/${quiz_id}/${title}/${timer}`);
                // /attemptQuiz/:quizID/:timeInSeconds
            } else {
                alert("Quiz not available at this moment!!")
            }
        }).catch(() => {
            alert("Error to check attempt.");
        })
    }
   


    return (
        <div style={{ backgroundColor: 'rgb(118 192 137)' }}>
            {<StudentHeader />}
            <div className="container mb-5" style={{paddingTop:'100px'}}>
                <h2 className=" mb-3 pb-2">Quizzes</h2>
                <table className="table ">
                    <thead>
                        <tr>
                            <th>Quiz ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Quiz Date</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Timer</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizzes.map((quiz, index) => (
                            <tr key={index}>
                                <td>{quiz.quiz_id}</td>
                                <td>{quiz.title}</td>
                                <td>{quiz.description}</td>
                                <td>{quiz.quiz_date}</td>
                                <td>{quiz.start_time}</td>
                                <td>{quiz.end_time}</td>
                                <td>{quiz.timer} sec.</td>
                                <td>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => checkForQuizAvailability(quiz.quiz_id, quiz.title, quiz.timer, quiz.start_time, quiz.end_time, quiz.quiz_date)}
                                    >
                                        AttemptQuiz
                                    </button>


                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {<Footer />}
        </div>
    )
}

export default ViewQuizzesToStudents