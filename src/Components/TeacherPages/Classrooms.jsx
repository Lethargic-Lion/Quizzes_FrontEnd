import React, { useEffect, useState } from 'react'
import Header from './Header'
import { Button, Card, Col, Container, Modal, Row } from 'react-bootstrap'
import axios from 'axios';
import Footer from '../Footer';
import '../../Css/Classrooms.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Classroom = () => {

    const [classrooms, setClassrooms] = useState([]);
    const teacher_id = localStorage.getItem('teacher_id');


    const [showEditModal, setShowEditModal] = useState(false);
    const closeEditModal = () => setShowEditModal(false);
    const openEditModal = () => setShowEditModal(true);
    const [currentClassroomID, setCurrentClassroomID] = useState(0);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const closeCreateModal = () => setShowCreateModal(false);
    const openCreateModal = () => setShowCreateModal(true);

    //setting modal form data
    const triggerEditModal = (classroom_id) => {
        setCurrentClassroomID(classroom_id);
        console.log(currentClassroomID);
        openEditModal();
    }
    const [formData, setFormData] = useState({
        title: "",
        description: ""
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    //postMethod for updating classroom
    const updateClassroomDetails = () => {
        console.log(formData);
        console.log(currentClassroomID);
        const url = 'http://localhost:8080/classroom/editClassroom/' + currentClassroomID;
        axios.put(url, formData)
            .then((response) => {
                if (response.status === 200) {
                    Swal.fire({
                        title: "Your Changes Have Been Saved!",
                        icon: "success"
                    })
                    // Close the modal and update the list of classrooms
                    setFormData({
                        title: "",
                        description: ""
                    })
                    closeEditModal();
                    getClassrooms();
                }
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Some error occurred while updating details!",
                });
            });
    };

    const createClassroom = () => {
        const url = 'http://localhost:8080/classroom/addClassroom/' + teacher_id;
        axios.post(url, formData)
            .then((response) => {
                if (response.status === 200) {
                    Swal.fire({
                        title: "Classroom Created Successfully!",
                        icon: "success"
                    })
                    closeCreateModal();
                    setFormData({
                        title: "",
                        description: ""
                    })
                    getClassrooms();
                }
            }).catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Some error occurred while creating classroom!",
                });
            });
    };

    useEffect(() => {
        getClassrooms();
    }, [])

    const getClassrooms = () => {
        let url = 'http://localhost:8080/classroom/getAllClassrooms';
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

    const deleteClassroom = (classroom_id) => {
        let url = 'http://localhost:8080/classroom/deleteClassroom/' + classroom_id;
        axios.delete(url).then(
            Swal.fire({
                title: "Classroom Deleted successfully!",
                icon: "success"
            })
        ).catch((error) => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            });
        });
        getClassrooms();
    }

    const navigate = useNavigate();
    const handleCardClick = (title, id) => {

        console.log("title->", title);
        console.log("id->", id);
        navigate(`/manageClassroom/${title}/${id}`)
    }
    // 



    return (
        <>
            <div >
                <Header />
                <div style={{ padding: '20px', paddingTop:'85px', backgroundColor: 'rgb(118 192 137)', height: '100vh' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignContent: 'center' }}>
                        <h1 style={{ marginBottom: '20px' }}>Classrooms</h1>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px', marginRight: '30px' }}>
                        <Button style={{ backgroundColor: '#910d8f', borderColor: 'purple', alignItems: 'end', fontSize: "large" }} onClick={openCreateModal}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                        </svg>{" "}Create a Classroom</Button>
                    </div>


                    <Container fluid >
                        <Row xs={1} md={2} lg={3} xl={4} style={{ marginLeft: '100px', marginRight: '100px' }}>
                            {classrooms.map((classroom) => (
                                <Col sm={4}>
                                    <Card key={classroom.classroom_id} className="classroom-card" style={{ width: '15rem', marginTop: '10px' }} >
                                        <Card.Body>
                                            <div style={{marginBottom:'8px'}} onClick={()=>handleCardClick(classroom.title,classroom.classroom_id)}>
                                                <Card.Title>{classroom.title}</Card.Title>
                                                <Card.Text>
                                                    {classroom.description}
                                                </Card.Text>
                                            </div>

                                            <Button variant="primary" data-toggle="tooltip" title="Edit Classroom Details" onClick={() => triggerEditModal(classroom.classroom_id)}>✏️ Edit</Button>{" "}
                                            <Button variant="secondary" data-toggle="tooltip" title="Delete Classroom" color='white' onClick={() => deleteClassroom(classroom.classroom_id)}>❌</Button>
                                        </Card.Body>
                                    </Card>

                                </Col>
                            ))}

                        </Row>
                    </Container>
                </div>
                <Footer />
            </div>

            <Modal show={showEditModal} onHide={closeEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Classroom Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Form inside the modal */}
                    <form>
                        <div className="form-group">
                            <label htmlFor="title">Title:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description:</label>
                            <textarea
                                className="form-control"
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeEditModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={updateClassroomDetails}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showCreateModal} onHide={closeCreateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter New Classroom Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label htmlFor="title">Title:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description:</label>
                            <textarea
                                className="form-control"
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeCreateModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={createClassroom}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    )
}

export default Classroom