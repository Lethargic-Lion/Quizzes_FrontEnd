import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import '../Css/Dashboard.css'
import Footer from './Footer';
import Swal from 'sweetalert2';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';

const Dashboard = () => {

    const navigate = useNavigate();

    const handleLoginClick = () => {
        // Display SweetAlert with Student and Teacher Login buttons
        Swal.fire({
            title: 'Choose Login Type',
            showCancelButton: true,
            confirmButtonText: 'Student Login',
            cancelButtonText: 'Teacher Login',
            cancelButtonColor: '#d33',
            confirmButtonColor: '#3085d6',
        }).then((result) => {
            if (result.isConfirmed) {
                // navigate(`/student`);
                openStudentLoginForm();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                navigate(`/teacher`);
            }
        });
    };

    //Student Login
    const [showStudentLoginForm, setShowStudentLoginForm] = useState(false);
    const closeStudentLoginForm = () => setShowStudentLoginForm(false);
    const openStudentLoginForm = () => setShowStudentLoginForm(true);


    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });

    const triggerCloseStudentLoginForm = () => {
        setLoginData({
            username: "",
            password: ""
        })
        closeStudentLoginForm();  
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const loginStudent = (e) => {
        const url = 'http://localhost:8080/student/login'
        axios.post(url, loginData).then(
            response => {
                const { student_id, firstName, lastName } = response.data;
                // console.log(response.data.student_id,"hello");

                localStorage.setItem('student_id', student_id);
                localStorage.setItem('firstName', firstName);
                localStorage.setItem('lastName', lastName);

                Swal.fire({
                    title: "Student logged in successfully!",
                    icon: "success"
                });
                closeStudentLoginForm();
                setLoginData({
                    username: "",
                    password: ""
                })
                navigate(`/viewQuizzesToStudents/${student_id}`);
            },

        ).catch(() => {
            setLoginData({
                username: '',
                password: ''
            })
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Wrong Username or Password!",
            });
        }
        );
    }

    return (

        <>
            <div className="dashboard">
                <div className="overlay">
                    <button className="login-button" onClick={handleLoginClick}>
                        Login
                    </button>
                    <h1 className="tagline">Unleash Your Knowledge, Embrace the Challenge</h1>
                    <h2 className="motto">Welcome to QuizQuest!</h2>
                </div>

                <Modal show={showStudentLoginForm} onHide={triggerCloseStudentLoginForm}>
                    <Modal.Header closeButton>
                        <Modal.Title>Student Login</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    name="username"
                                    value={loginData.username}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password:</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    value={loginData.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </form>



                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={triggerCloseStudentLoginForm}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={loginStudent}>
                            Login
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
            {<Footer />}
        </>






    );
}

export default Dashboard