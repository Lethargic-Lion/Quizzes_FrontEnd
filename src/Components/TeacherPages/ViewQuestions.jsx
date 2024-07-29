import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap';
import Header from './Header';
import Footer from '../Footer';
import { Link, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../Css/ViewQuestions.css'

const ViewQuestions = () => {

    const { quizID } = useParams();
    const [questionData, setQuestionData] = useState([]);

    useEffect(() => {
        displayQuestions()
    }, [])

    const displayQuestions = () => {
        let url = 'http://localhost:8080/question/getQuestionsByQuizId/' + quizID;
        axios.get(url, {
            Headers: {
                "Context-Type": "application/json",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "+",
            }
        }).then((response) => {
            if (response.status === 200) {
                if (response.data.length === 0) {
                    // Display Sweet Alert when no questions are present
                    Swal.fire({
                        icon: 'info',
                        title: 'No Questions',
                        text: 'No questions present in this quiz.',
                    });
                } else {
                    console.log(response.data);
                    setQuestionData(response.data);
                    // console.log(questionData);
                }
            }
        }).catch((error) => {
            alert("Some error")
        })
    }

    const deleteQuestion = (question_id) => {
        let url = 'http://localhost:8080/question/deleteQuestionById/' + question_id;
        axios.delete(url);
        displayQuestions();
    }

    return (
        <div style={{backgroundColor: 'rgb(118 192 137)'}}>
            {<Header />}
            <div style={{  paddingTop:'85px' , paddingBottom:'70px' }}>

                {console.log(questionData)}
                <h1 style={{marginBottom:'20px'}}>Questions</h1>
                <Container fluid>
                    <Row xs={1} md={2} lg={3} xl={4}>
                        {questionData.map((question) => (
                            <Col key={question.questionId} >
                                <Card className="mb-4 p question-card">
                                    <Card.Body style={{ height: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <Card.Title>{question.questionId + '. '}{question.questionText}</Card.Title>
                                        
                                        <Card.Text>

                                            {(question.questionType === 'single_correct_mcq' || question.questionType === 'multiple_correct_mcq') && (
                                                question.mcqOptions.map((option) => (
                                                    <p key={option.id} style={{ color: option.correct ? 'green' : 'red', fontWeight: option.correct ? 'bold' : 'normal' , textAlign:'left' , marginLeft:'20px'}}>
                                                        → {option.optionDescription}
                                                    </p>
                                                ))
                                            )}

                                            {question.questionType === 'fill_ups' && (
                                                <p style={{ color: 'green', fontWeight: 'bold' }}>Answer: {question.fill_up.fillText}</p>
                                            )}




                                        </Card.Text>
                                        <div >
                                            <button
                                                className="btn btn-light"
                                                onClick={() => deleteQuestion(question.questionId)}
                                                data-toggle="tooltip"
                                                title="Delete Question"
                                                style={{ marginRight: '5px' }}
                                            >
                                                ❌
                                            </button>{"    "}
                                            <Link to={`/updateQuestion/${question.questionId}`}>
                                                <button className="btn btn-light mr-2" data-toggle="tooltip" title="Edit Question">✏️</button>
                                            </Link>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>

            </div>
            {<Footer />}
        </div>

    )
}

export default ViewQuestions


















