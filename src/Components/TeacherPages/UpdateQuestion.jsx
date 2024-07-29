import React, { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom'
import Footer from '../Footer';
import Header from './Header';
import axios from 'axios';

const UpdateQuestion = () => {

    const { question_ID } = useParams();

    const [questionType, setQuestionType] = useState('single_correct_mcq');
    const [questionText, setQuestionText] = useState('');
    const [fillText, setFillText] = useState('');
    const [mcqOptions, setOptions] = useState([{ optionDescription: '', correct: false }]);

    const handleQuestionTypeChange = (e) => {
        setQuestionType(e.target.value);
    };

    const handleOptionChange = (index, field, value) => {
        const newOptions = [...mcqOptions];
        newOptions[index][field] = value;
        setOptions(newOptions);
    };

    const handleAddOption = () => {
        setOptions([...mcqOptions, { optionDescription: '', correct: false }]);
    };

    const handleRemoveOption = (index) => {
        const newOptions = [...mcqOptions];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    };

    const resetForm = () => {
        setQuestionType('single_correct_mcq');
        setQuestionText('');
        setFillText('');
        setOptions([{ optionDescription: '', correct: false }]);
    };

    const handleSubmit = () => {

        const url = 'http://localhost:8080/question/editQuestion/' + question_ID;

        const questionData = {
            questionText,
            questionType,

        }
        if (questionType === "fill_ups") {
            questionData["fill_up"] = {
                "fillText": fillText
            }
        }
        else {
            questionData.mcqOptions = mcqOptions
        }
        axios.put(url, questionData).then(
            () => {
                resetForm();
                alert('Question Updated Successfully');
            }
        ).catch()
        console.log({
            questionType,
            questionText,
            fillText,
            mcqOptions
        });
    };

    return (
        <div style={{backgroundColor: 'rgb(118 192 137)'}}>
            <Header/>
            <div className="container" style={{paddingTop:'90px' , paddingBottom:'50px'}}>
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h2 className="card-title mb-4">Enter Question Details for updation:</h2>
                                <Container>
                                    <Form>
                                        <Form.Group controlId="questionType">
                                            <Form.Label>Question Type:</Form.Label>
                                            <Form.Control as="select" value={questionType} onChange={handleQuestionTypeChange}>
                                                <option value="single_correct_mcq">Single Correct MCQ</option>
                                                <option value="fill_ups">Fill Ups</option>
                                            </Form.Control>
                                        </Form.Group>

                                        <Form.Group controlId="questionText">
                                            <Form.Label>Question Text:</Form.Label>
                                            <Form.Control type="text" value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
                                        </Form.Group>

                                        {questionType === 'fill_ups' && (
                                            <Form.Group controlId="fillText">
                                                <Form.Label>Fill Up Text:</Form.Label>
                                                <Form.Control type="text" value={fillText} onChange={(e) => setFillText(e.target.value)} />
                                            </Form.Group>
                                        )}

                                        {questionType !== 'fill_ups' && (
                                            <div>
                                                <Form.Label>Options:</Form.Label>
                                                {mcqOptions.map((option, index) => (
                                                    <Row key={index} className="mb-2">
                                                        <Col>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Option optionDescription"
                                                                value={option.optionDescription}
                                                                onChange={(e) => handleOptionChange(index, 'optionDescription', e.target.value)}
                                                            />
                                                        </Col>
                                                        <Col xs="auto">
                                                            <Form.Check
                                                                type="checkbox"
                                                                label="Is Correct"
                                                                checked={option.correct}
                                                                onChange={(e) => handleOptionChange(index, 'correct', e.target.checked)}
                                                            />
                                                        </Col>
                                                        <Col xs="auto">
                                                            <Button variant="danger" onClick={() => handleRemoveOption(index)}>
                                                                Remove
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                ))}
                                                <Button variant="secondary" onClick={handleAddOption}>
                                                    Add Option
                                                </Button>
                                            </div>
                                        )}

                                        <Button variant="primary" onClick={handleSubmit}>
                                            Update
                                        </Button>
                                    </Form>
                                </Container>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default UpdateQuestion