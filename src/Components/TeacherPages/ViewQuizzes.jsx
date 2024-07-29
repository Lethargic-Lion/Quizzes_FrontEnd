import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import Header from './Header';
import Footer from '../Footer';


const ViewQuizzes = () => {

    const [quizzes, setQuizzes] = useState([]);
    // const {teacher_id} = useParams();

    // console.log(teacher_id);

    useEffect(() => {
        displayQuizzes()
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

    const deleteQuiz = (quiz_id) => {
        let url = 'http://localhost:8080/quiz/deleteQuizById/' + quiz_id;
        axios.delete(url);
        displayQuizzes();
    }

    return (
        
        <div style={{ backgroundColor: 'rgb(118 192 137)' }}>
            {/* <Header passedValue={teacher_id}/> */}
            <div >
                <Header />
            </div>

            <div className="container" style={{paddingTop:'80px' , paddingBottom:'40px'}}>
                <h2 className="mt-3 mb-3">Quizzes</h2>
                <table className="table rounded">
                    <thead >
                        <tr>
                            <th>Quiz ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Date</th>
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
                                <td className='d-flex'>
                                    <button
                                        className="btn btn-light mr-4"
                                        onClick={() => deleteQuiz(quiz.quiz_id)}
                                        style={{ color: 'red' }}
                                        data-toggle="tooltip"
                                        title="Delete Quiz"
                                    >
                                        ❌
                                    </button>
                                    <Link to={`/updateQuiz/${quiz.quiz_id}`}>
                                        <button className="btn btn-light mr-2" data-toggle="tooltip" title="Edit Quiz">✏️</button>
                                    </Link>
                                    <Link to={`/questionform/${quiz.quiz_id}`}>
                                        <button className="btn btn-light mr-2" data-toggle="tooltip" title="Add Question">➕</button>
                                    </Link>{'  '}
                                    <Link to={`/viewQuestion/${quiz.quiz_id}`}>
                                        <button className="btn btn-light" data-toggle="tooltip" title="View Questions">👁️</button>
                                    </Link>
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

export default ViewQuizzes