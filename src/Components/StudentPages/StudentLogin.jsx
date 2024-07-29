import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const StudentLogin = () => {

    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });

    const navigate = useNavigate();

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
        <div style={{backgroundColor: 'rgb(118 192 137)' ,height:'100vh'}}>
            <div className="container pt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h2 className="card-title mb-4">Student Login</h2>

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


                                <button type="submit" className="btn btn-primary" onClick={loginStudent}>Login</button>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default StudentLogin