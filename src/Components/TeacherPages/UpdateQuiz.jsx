import axios from 'axios';
import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from './Header';
import Footer from '../Footer';
import { Button, Grid, TextField, Typography } from '@mui/material';

const UpdateQuiz = () => {

    const { quiz_ID } = useParams();

    const [quizData, setQuizData] = useState({
        title: '',
        description: '',
        timer: '',
        start_time: '09:00:00',
        end_time: '23:00:00',
        quiz_date: 'mm/dd/yyyy'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        let newValue = value;
        const timerRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
        if (name === 'timer') {
            const [hours, minutes] = value.split(':');
            if (timerRegex.test(value)) {
                newValue = parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60;
            }
        }

        setQuizData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));
    };

    const validateForm = () => {
        let isValid = true;

        // Validate title
        if (quizData.title.trim() === '') {
            alert("Please Enter the Title of Quiz!!")
            isValid = false;
        }

        //validate timer
        console.log("type of timer: ", typeof (quizData.timer));
        if (isNaN(quizData.timer)) {
            isValid = false;
            alert("Please Enter Timer Value in HH:MM format");
        }

        // Validate description
        if (quizData.description.trim() === '') {
            alert("Please Enter the Description of Quiz!!")
            isValid = false;
        }

        // Validate quiz_date
        if (quizData.quiz_date.trim() === '' || quizData.quiz_date.trim() === 'mm/dd/yyyy') {
            alert("Please Enter a Valid Date!!")
            isValid = false;
        }

        return isValid;
    };

    const updateQuiz = () => {
        if (validateForm()) {
            // console.log(JSON.stringify(quizData))
            const url = 'http://localhost:8080/quiz/editQuiz/' + quiz_ID
            axios.put(url, quizData).then(
                Swal.fire({
                    title: "Quiz Updated successfully!",
                    icon: "success"
                }),
                setQuizData({
                    title: '',
                    description: '',
                    timer: '',
                    start_time: '09:00:00',
                    end_time: '23:00:00',
                    quiz_date: 'mm/dd/yyyy'
                })

            ).catch((e) => {
                alert("Some error in updating quiz.")
            }
            )
        }
    }

    return (
        <div style={{ backgroundColor: 'rgb(118 192 137)' }}>
            {<Header />}

            <div className="container" style={{ paddingTop: '90px' }}>
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card" style={{ marginBottom: "40px" , marginTop:'20px' }}>
                            <div className="card-body">
                                <React.Fragment>
                                    <Typography variant="h5" gutterBottom>
                                        Enter Quiz Details
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                id="title"
                                                name="title"
                                                value={quizData.title}
                                                onChange={handleInputChange}
                                                label="Title"
                                                fullWidth
                                                // autoComplete="given-name"
                                                variant="standard"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                id="timer"
                                                name="timer"
                                                value={quizData.timer}
                                                placeholder='HH:MM'
                                                onChange={handleInputChange}
                                                label="Timer(in seconds)"
                                                fullWidth
                                                // autoComplete="family-name"
                                                variant="standard"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                id="description"
                                                name="description"
                                                value={quizData.description}
                                                onChange={handleInputChange}
                                                label="Description"
                                                fullWidth
                                                // autoComplete="shipping address-line1"
                                                variant="standard"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                type="time"
                                                step="1"
                                                id="start_time"
                                                name="start_time"
                                                label="Start Time"
                                                value={quizData.start_time}
                                                onChange={handleInputChange}
                                                fullWidth
                                                // autoComplete="shipping postal-code"
                                                variant="standard"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                type="time"
                                                step="1"
                                                id="end_time"
                                                name="end_time"
                                                label="End Time"
                                                value={quizData.end_time}
                                                onChange={handleInputChange}
                                                fullWidth
                                                // autoComplete="shipping postal-code"
                                                variant="standard"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                type='date'
                                                id="quiz_date"
                                                name="quiz_date"
                                                value={quizData.quiz_date}
                                                onChange={handleInputChange}
                                                label="Quiz Date"
                                                placeholder=''
                                                fullWidth
                                                // autoComplete="shipping address-level2"
                                                variant="standard"
                                            />
                                        </Grid>
                                    </Grid>
                                </React.Fragment>
                                <Button
                                    variant="contained"
                                    onClick={updateQuiz}
                                    sx={{ mt: 3, ml: 1 }}
                                >
                                    Update
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {<Footer />}
        </div>
    )
}

export default UpdateQuiz