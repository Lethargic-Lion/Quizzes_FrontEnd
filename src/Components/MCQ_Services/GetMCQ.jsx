import axios from 'axios';
import React, { useEffect, useState } from 'react'

const GetMCQ = () => {
    const [questions, setQuestions] = useState([]);
    
    useEffect(() => {
        viewQuestions()
    }, [])

    const viewQuestions = () => {

        let url = 'http://localhost:8080/mcqquestion/getAllQuestions';
        axios.get(url, {
            Headers: {
                "Context-Type": "application/json",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "+",
            }
        }).then((response) => {
            if (response.status === 200) {
                console.log(response.data);
                setQuestions(response.data)
                console.log(questions)
            }
        }).catch(error => {
            alert("error")
        })
    }

    const deleteQuestion = (id) => {
        let url = 'http://localhost:8080/mcqquestion/deleteQuestion/'+id;
        axios.delete(url);
        viewQuestions();
    }

    const editQuestion = () => {

    }

    return (
        <div>
            <div className="container">
                <h2 className="mt-4 mb-3">Show Questions</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Question</th>
                            <th>Option1</th>
                            <th>Option2</th>
                            <th>Option3</th>
                            <th>Correct Solution</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((question) => (
                            <tr key={question.questionNumber}>
                                <td>{question.questionDescription}</td>
                                <td>{question.option1}</td>
                                <td>{question.option2}</td>
                                <td>{question.option3}</td>
                                <td>{question.correctOption}</td>
                                <td>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => deleteQuestion(question.questionNumber)}
                                    >
                                        Delete
                                    </button>{" "}
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => editQuestion(question)}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default GetMCQ