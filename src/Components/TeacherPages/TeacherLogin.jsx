import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useTeacherContext } from '../context/TeacherContext';


const TeacherLogin = () => {

    // const { setTeacherIdValue } = useTeacherContext();

    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const addTeacher = (e) => {
        const url = 'http://localhost:8080/teacher/addTeacher'
        axios.post(url, loginData).then(
            response => {
                const { teacher_id } = response.data;

                localStorage.setItem('teacher_id', teacher_id);

                Swal.fire({
                    title: "Teacher logged in successfully!",
                    icon: "success"
                });

                navigate(`/viewquizzes`);
                // navigate(`/quizform/:teacher_id`);
            },

        ).catch(() => {
            setLoginData({
                username: '',
                password: ''
            })
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
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
                                <h2 className="card-title mb-4">Teacher Login</h2>

                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Username:</label>
                                    <input
                                        type="text"
                                        className="form-control required"
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
                                        className="form-control required"
                                        id="password"
                                        name="password"
                                        value={loginData.password}
                                        onChange={handleInputChange}
                                    />
                                </div>


                                <button type="submit" className="btn btn-primary" onClick={addTeacher}>Login</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default TeacherLogin