import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import Swal from 'sweetalert2';
import StudentHeader from './StudentHeader';
import Footer from '../Footer';
import { useNavigate } from 'react-router-dom';

const StudentClassrooms = () => {
    const student_id = localStorage.getItem("student_id");

    const [classrooms, setClassrooms] = useState([]);
    useEffect(() => {
        getClassrooms();
    }, [])
    const getClassrooms = () => {
        let url = 'http://localhost:8080/student/classroomsNotJoined/' + student_id;
        axios.get(url, {
            Headers: {
                "Context-Type": "application/json",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "+",
            }
        }).then((response) => {
            if (response.status === 200) {
                console.log(response.data);
                setClassrooms(response.data)
                console.log(classrooms)
            }
        }).catch((error) => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            });
        });
    }

    const joinClassroom = async (classroom_id) => {
        const url = 'http://localhost:8080/student/joinClassroom/' + student_id + '/' + classroom_id;
        axios.post(url)
            .then((response) => {
                if (response.status === 200) {
                    Swal.fire({
                        title: "Classroom Joined Successfully!",
                        icon: "success"
                    })
                    // getJoinedClassrooms();
                }
            }).catch((error) => {
                // console.error('Error joining classroom:', error.response ? error.response.data : error.message);
                // setErrorMessage(error.response ? error.response.data : 'An error occurred while joining the classroom');
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Some error occurred!",
                });
            });
    }

    const [joinedClassrooms, setJoinedClassrooms] = useState([]);
    useEffect(() => {
        getJoinedClassrooms();
    }, [])
    const getJoinedClassrooms = () => {
        console.log("student id is: ", student_id);
        let url = 'http://localhost:8080/student/getClassroomsByStudentID/' + student_id;
        axios.get(url, {
            Headers: {
                "Context-Type": "application/json",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "+",
            }
        }).then((response) => {
            if (response.status === 200) {
                console.log(response.data);
                setJoinedClassrooms(response.data)
                console.log(classrooms)
            }
        }).catch((error) => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            });
        });
    }

    const navigate = useNavigate();
    const handleCardClick=(title,id)=>{
        console.log("title->", title);
        console.log("id->", id);
        navigate(`/classroomQuizzes/${title}/${id}`)
    }



    return (
        <div>
            <StudentHeader />
            <div style={{ padding: '20px', paddingTop:'90px', paddingBottom:'50px', backgroundColor: 'rgb(118 192 137)', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignContent: 'center' }}>
                    <h1 style={{ marginBottom: '20px' }}>Classrooms</h1>
                </div>
                <Container fluid >
                    <Row xs={1} md={2} lg={3} xl={4} style={{ marginLeft: '100px', marginRight: '100px' }}>
                        {classrooms.map((classroom) => (
                            <Col sm={4}>
                                <Card key={classroom.classroom_id} className="classroom-card" style={{ width: '15rem', marginTop: '10px' }} >
                                    <Card.Body>
                                        <div style={{ marginBottom: '8px' }}>
                                            <Card.Title>{classroom.title}</Card.Title>
                                            <Card.Text>
                                                {classroom.description}
                                            </Card.Text>
                                        </div>

                                        <Button variant="primary" data-toggle="tooltip" onClick={() => joinClassroom(classroom.classroom_id)}>Join</Button>

                                    </Card.Body>
                                </Card>

                            </Col>
                        ))}

                    </Row>
                </Container>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignContent: 'center', marginTop: '40px' }}>
                    <h1 style={{ marginBottom: '20px' }}>Joined Classrooms</h1>
                </div>
                <Container fluid >
                    <Row xs={1} md={2} lg={3} xl={4} style={{ marginLeft: '100px', marginRight: '100px' }}>
                        {joinedClassrooms.map((classroom) => (
                            <Col sm={4}>
                                <Card key={classroom.classroom_id} className="classroom-card" style={{ width: '15rem', marginTop: '10px' }} >
                                    <Card.Body>
                                        <div style={{ marginBottom: '8px' }} onClick={() => handleCardClick(classroom.title, classroom.classroom_id)}>
                                            <Card.Title>{classroom.title}</Card.Title>
                                            <Card.Text>
                                                {classroom.description}
                                            </Card.Text>
                                        </div>
                                    </Card.Body>
                                </Card>

                            </Col>
                        ))}

                    </Row>
                </Container>
            </div>
            <Footer />
        </div>
    )
}

export default StudentClassrooms