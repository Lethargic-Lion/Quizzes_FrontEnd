import axios from 'axios';
import React, { useState } from 'react'
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PostMCQ = () => {
    const [question, setQuestion] = useState({
        questionDescription: "",
        option1: "",
        option2: "",
        option3: "",
        correctOption: ""
    })

    const setValue = (e) => {
        const { name, value } = e.target;
        setQuestion(prev => (
            { ...prev, [name]: value }
        ))
    }

    const addQuestion = () => {

        alert("Question added successfully")
        const url = 'http://localhost:8080/mcqquestion/addQuestion'
        axios.post(url, question).then(
            setQuestion({
                questionDescription: "",
                option1: "",
                option2: "",
                option3: "",
                correctOption: ""
            })
        ).catch()
    }



    return (
        <Container className="mt-4">
            <h2>Post MCQ Questions</h2>
            <Form>
                <Form.Group controlId="questionDescription">
                    <Form.Label>Question Description</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Question"
                        value={question.questionDescription}
                        onChange={setValue}
                        name="questionDescription"
                    />
                </Form.Group>

                <Row>
                    <Col>
                        <Form.Group controlId="option1">
                            <Form.Label>Option 1</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Option 1"
                                value={question.option1}
                                onChange={setValue}
                                name="option1"
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="option2">
                            <Form.Label>Option 2</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Option 2"
                                value={question.option2}
                                onChange={setValue}
                                name="option2"
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="option3">
                            <Form.Label>Option 3</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Option 3"
                                value={question.option3}
                                onChange={setValue}
                                name="option3"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group controlId="correctOption">
                    <Form.Label>Correct Option</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Correct Option"
                        value={question.correctOption}
                        onChange={setValue}
                        name="correctOption"
                    />
                </Form.Group>

                <Button variant="primary" onClick={addQuestion}>
                    Add Question
                </Button>
                <Link to='/getmcq'>
                    <Button>View Questions</Button>
                </Link>

            </Form>
        </Container>
    )
}

export default PostMCQ