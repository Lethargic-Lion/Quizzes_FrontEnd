import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

const YourComponent = () => {
    const [question, setQuestion] = useState({
        questionDescription: '',
        option1: '',
        option2: '',
        option3: '',
        correctOption: '',
    });

    const setValue = (e) => {
        const { name, value } = e.target;
        setQuestion({ ...question, [name]: value });
    };

    const addQuestion = () => {
        // Add your logic here to save the question, update state, etc.
        console.log('Adding Question:', question);
    };

    const viewQuestions =()=>{
        
    }

    return (
        <Container className="mt-4">
            <h2>Post MCQ Questions</h2>
            <Form>
                <Form.Group controlId="questionDescription">
                    <Form.Label>Enter Question Description</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Question Description"
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
                                placeholder="Option 1"
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
                                placeholder="Option 2"
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
                                placeholder="Option 3"
                                value={question.option3}
                                onChange={setValue}
                                name="option3"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group controlId="correctOption">
                    <Form.Label>Correct Option Number</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Correct Option Number"
                        value={question.correctOption}
                        onChange={setValue}
                        name="correctOption"
                    />
                </Form.Group>

                <Button variant="primary" onClick={addQuestion}>
                    Add Question
                </Button>
                <Button variant="primary" onClick={viewQuestions}>
                    View Question
                </Button>
            </Form>
        </Container>
    );
};

export default YourComponent;
