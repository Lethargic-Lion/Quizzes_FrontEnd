import React, { useEffect, useState } from 'react'
import Header from './Header'
import Footer from '../Footer'
import { Link, useParams } from 'react-router-dom'
import { Card, CardBody, CardGroup, CardSubtitle, CardTitle, Col, Container, Row, Tab, Table, Tabs } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faBullseye } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'

const QuizReports = () => {
    const { classroom_id, quiz_id, quiz_title, quiz_date, countStudentsOfClassroom } = useParams();
    const [results, setResults] = useState([]);

    useEffect(() => {
        getQuestions();
    }, [])

    const [questionData, setQuestionData] = useState([]);
    const [countOfQuestions, setCountOfQuestions] = useState();
    const getQuestions = () => {
        let url = 'http://localhost:8080/question/getQuestionsByQuizId/' + quiz_id;
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
                setQuestionData(response.data);
                setCountOfQuestions(response.data.length);
                console.log(questionData)
            }
        }).catch((error) => {
            console.log(questionData)
            console.log()
            alert("Some error")
        })
    }

    const [resultData, setResultData] = useState([]);
    useEffect(() => {
        getResults();
    }, []);

    const [totalParticipants, setTotalParticipants] = useState(0);
    const [totalScore, setTotalScore] = useState(0);

    const getResults = () => {
        let url = 'http://localhost:8080/result/getResultsByQuizID/' + quiz_id;
        axios.get(url, {
            Headers: {
                "Context-Type": "application/json",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "+",
            }
        }).then((response) => {
            if (response.status === 200) {
                console.log(response.data);
                setResultData(response.data);
                const totalParticipants = response.data.length;
                setTotalParticipants(totalParticipants);
                const totalPointsGained = response.data.reduce((acc, result) => acc + result.score, 0);
                setTotalScore(totalPointsGained);
            }
        }).catch(error => {
            alert("Some error getting results")
        })
    }

    const accuracy = (totalScore / (countOfQuestions * countStudentsOfClassroom)) * 100;


    const [students, setStudents] = useState([]);
    const getStudentsOfClassroom = () => {
        let url = 'http://localhost:8080/classroom/getStudentsByClassroomId/' + classroom_id;
        axios.get(url, {
            Headers: {
                "Context-Type": "application/json",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "+",
            }
        }).then((response) => {
            if (response.status === 200) {
                console.log(response.data);
                setStudents(response.data);
                console.log(students);
            }
        }).catch(error => {
            alert("Some error displaying students")
        })
    }

    const resetAttempt = (student_id) => {
        let url = 'http://localhost:8080/result/resetStudentAttempt/'+student_id+'/'+quiz_id;
        axios.delete(url).then().catch((error)=>{
            alert("Some error in resetting attempts.")
        });
    }


    useEffect(() => {
        displayQuestions();
        getStudentsOfClassroom();
    }, [])

    const displayQuestions = () => {
        let url = 'http://localhost:8080/question/getQuestionsByQuizId/' + quiz_id;
        axios.get(url, {
            Headers: {
                "Context-Type": "application/json",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "+",
            }
        }).then((response) => {
            if (response.status === 200) {

                console.log(response.data);
                setQuestionData(response.data);
                // console.log(questionData);

            }
        }).catch((error) => {
            alert("Some error")
        })
    }

    return (
        <>
            <div>
                <Header />
                <div style={{ padding: '20px', paddingTop:'85px', paddingBottom:'40px', backgroundColor: 'rgb(118 192 137)', height: '100' }}>
                    <Card style={{ marginTop: '20px', marginRight: '70px', marginLeft: '70px' }}>
                        <Card.Header style={{ backgroundColor: 'navy' }} />
                        <CardBody>
                            <CardTitle>{quiz_title}</CardTitle>
                            <CardSubtitle>Started on: {quiz_date}</CardSubtitle>
                        </CardBody>
                    </Card>

                    <Card style={{ marginTop: '20px', marginRight: '70px', marginLeft: '70px' }}>
                        <CardBody>
                            <CardGroup>
                                {/* First Small Card */}
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Accuracy</Card.Title>
                                        <Card.Text>{Math.round(accuracy)}%</Card.Text>
                                    </Card.Body>
                                </Card>

                                {/* Second Small Card */}
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Completion Rate</Card.Title>
                                        <Card.Text>{totalParticipants * 100 / countStudentsOfClassroom}%</Card.Text>
                                    </Card.Body>
                                </Card>

                                {/* Third Small Card */}
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Student Assigned</Card.Title>
                                        <Card.Text>{countStudentsOfClassroom}</Card.Text>
                                    </Card.Body>
                                </Card>

                                {/* Fourth Small Card */}
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Questions</Card.Title>
                                        <Card.Text>{countOfQuestions}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </CardGroup>
                        </CardBody>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', margin: '10px', marginTop: '5px' }}><span><b>Class Insight:</b> </span>
                            <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '10px' }}>
                                <div style={{ marginRight: '10px', border: '10px' }}>{totalParticipants} completed</div>
                                <div>{countStudentsOfClassroom - totalParticipants} incomplete</div>
                            </div>
                        </div>
                    </Card>
                    <div style={{ marginLeft: '70px', marginRight: '70px', marginTop: '30px' }}>
                        <Tabs
                            defaultActiveKey="participants"
                            id="fill-tab-example"
                            className="mb-3"
                            fill
                            style={{ marginTop: '30px' }}
                        >
                            <Tab eventKey="participants" title="Participants">
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>Student ID</th>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Email</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student, index) => (
                                            <tr key={index}>
                                                <td>{student.student_id}</td>
                                                <td>{student.firstName}</td>
                                                <td>{student.lastName}</td>
                                                <td>{student.email}</td>
                                                <td className='d-flex'>
                                                    <button
                                                        onClick={()=> resetAttempt(student.student_id)}
                                                        className="btn btn-light mr-4"
                                                        style={{ color: 'red' }}
                                                        data-toggle="tooltip"
                                                        title="Reset Quiz Attempt"
                                                    >
                                                        🔄
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Tab>
                            <Tab eventKey="questions" title="Questions">
                                <Container fluid>
                                    <Row xs={1} md={2} lg={3} xl={4}>
                                        {questionData.map((question) => (
                                            <Col key={question.questionId} >
                                                <Card className="mb-4 p question-card">
                                                    <Card.Body style={{ height: '200px', display: 'flex', flexDirection: 'column' }}>
                                                        <Card.Title>{question.questionId + '. '}{question.questionText}</Card.Title>

                                                        <Card.Text >
                                                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                                {(question.questionType === 'single_correct_mcq' || question.questionType === 'multiple_correct_mcq') && (
                                                                    question.mcqOptions.map((option) => (
                                                                        <p key={option.id} style={{ color: option.correct ? 'green' : 'red', fontWeight: option.correct ? 'bold' : 'normal', textAlign: 'left', marginLeft: '20px' }}>
                                                                            → {option.optionDescription}
                                                                        </p>
                                                                    ))
                                                                )}

                                                                {question.questionType === 'fill_ups' && (
                                                                    <p className='mt-5' style={{ color: 'green', fontWeight: 'bold' }}>Answer: {question.fill_up.fillText}</p>
                                                                )}

                                                            </div>





                                                        </Card.Text>

                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                </Container>
                            </Tab>
                            {/* <Tab eventKey="overview" title="Overview">

                            </Tab> */}
                        </Tabs>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default QuizReports