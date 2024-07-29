import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import Header from './Header';
import Footer from '../Footer';
import { Accordion, Button, Card, CardBody, CardTitle, Modal, Tab, Table, Tabs } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import ClassroomReports from './ClassroomReports';

const ManageClassroom = () => {
    const navigate = useNavigate()
    const { title, classroom_id } = useParams();
    const teacher_id = localStorage.getItem('teacher_id');

    const [showCreateModal, setShowCreateModal] = useState(false);
    const closeCreateModal = () => setShowCreateModal(false);
    const openCreateModal = () => setShowCreateModal(true);

    const [students, setStudents] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [quizData, setQuizData] = useState({
        title: '',
        description: '',
        timer: 0,
        start_time: '00:00:00',
        end_time: '00:00:00',
        quiz_date: ''
    });

    useEffect(() => {
        displayQuizzes()
    }, [])

    const displayQuizzes = () => {
        let url = 'http://localhost:8080/quiz/getQuizByClassroomID/' + classroom_id;
        axios.get(url, {
            Headers: {
                "Context-Type": "application/json",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "+",
            }
        }).then((response) => {
            if (response.status === 200) {
                console.log(response.data);
                setQuizzes(response.data)
                console.log(quizzes)
            }
        }).catch(error => {
            alert("Some error displaying all the quizzes")
        })
    }

    useEffect(() => {
        getStudentsOfClassroom()
    }, [])

    const [countStudentsOfClassroom, setCountStudentsOfClassroom] = useState(0);
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
                setCountStudentsOfClassroom(response.data.length);
                console.log(students);
            }
        }).catch(error => {
            alert("Some error displaying students")
        })
    }

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

    const addQuiz = () => {
        const url = 'http://localhost:8080/quiz/addQuizToClassroom/' + teacher_id + '/' + classroom_id;
        axios.post(url, quizData).then(
            closeCreateModal(),
            Swal.fire({
                title: "Quiz Created successfully!",
                icon: "success"
            }),
            setQuizData({
                title: '',
                description: '',
                timer: 0,
                start_time: '00:00:00',
                end_time: '00:00:00',
                quiz_date: '',
            })

        ).catch((e) => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            });
        }
        )
    }

    //Edit Quiz Details
    const [currentQuizID, setCurrentQuizID] = useState(0);
    const triggerEditModal = (quiz_ID) => {
        setCurrentQuizID(quiz_ID);
        openEditModal();
    }

    const [showEditModal, setShowEditModal] = useState(false);
    const closeEditModal = () => setShowEditModal(false);
    const openEditModal = () => setShowEditModal(true);

    const editQuiz = () => {
        // console.log(JSON.stringify(quizData))
        const url = 'http://localhost:8080/quiz/editQuiz/' + currentQuizID;
        axios.put(url, quizData).then(
            closeEditModal(),
            setQuizData({
                title: '',
                description: '',
                timer: 0,
                start_time: '00:00:00',
                end_time: '00:00:00',
                quiz_date: ''
            }),
            Swal.fire({
                title: "Quiz Updated successfully!",
                icon: "success"
            })

        ).catch((e) => {
            alert("Some error in updating quiz.")
        }
        )

    }

    const deleteQuiz = (quiz_id) => {
        let url = 'http://localhost:8080/quiz/deleteQuizById/' + quiz_id;
        axios.delete(url);
        displayQuizzes();
    }

    const removeStudentFromClassroom = (student_id) => {
        let url = 'http://localhost:8080/student/removeFromClassroom/' + student_id + '/' + classroom_id;
        axios.post(url).then(
            Swal.fire({
                title: "Student Removed!!",
                icon: "success"
            })
        ).catch((e) => {
            Swal.fire({
                title: "Some error in removing student form classroom",
                icon: "error"
            })
        });
        getStudentsOfClassroom();
    }


    const [resultData, setResultData] = useState([]);
    useEffect(() => {
        getResults();
    }, []);

    const [totalParticipants, setTotalParticipants] = useState(0);
    const [quizAccuracy, setQuizAccuracy] = useState({});

    useEffect(() => {
        quizzes.forEach(quiz => {
            calculateAccuracy(quiz.quiz_id);
        });
    }, [quizzes, countStudentsOfClassroom]);

    const calculateAccuracy = (quizId) => {
        // ... existing code ...
        const countOfQuestions = 2;
        // Calculated accuracy for the specific quiz
        const accuracyValue = (totalScore / (countOfQuestions * countStudentsOfClassroom)) * 100;

        // Updated the state with the accuracy for the specific quiz
        setQuizAccuracy(prevState => ({
            ...prevState,
            [quizId]: accuracyValue,
        }));
    };

    const [totalScore, setTotalScore] = useState();

    const getResults = () => {
        let url = 'http://localhost:8080/result/getResultsByQuizID/' + classroom_id;
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
                console.log(students);
                const totalPointsGained = response.data.reduce((acc, result) => acc + result.score, 0);
                setTotalScore(totalPointsGained);
            }
        }).catch(error => {
            alert("Some error getting results")
        })
    }

    const [averageScore, setAverageScore] = useState(0);

    useEffect(() => {
        const scores = resultData.map(result => result.score);
        const totalScore = scores.reduce((acc, score) => acc + score, 0);
        console.log(totalScore);
        const newAverageScore = resultData.length > 0 ? totalScore / resultData.length : 0;
        setAverageScore(newAverageScore);
    }, [resultData]);


    const navigateToQuizDetails = (quiz_id, quiz_title, quiz_date, countStudentsOfClassroom) => {
        navigate(`/QuizReport/${classroom_id}/${quiz_id}/${quiz_title}/${quiz_date}/${countStudentsOfClassroom}`)
    }

    const [results, setResults] = useState([]);
    const [filteredData, setFilteredData] = useState(results);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/result/getResults');
                setResults(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Filter data based on selected quiz and student
    useEffect(() => {
        let filteredResults = results;

        if (selectedQuiz) {
            filteredResults = filteredResults.filter(result => result.name === selectedQuiz);
        }

        if (selectedStudent) {
            filteredResults = filteredResults.filter(result => result.student_Fname === selectedStudent);
        }

        setFilteredData(filteredResults);
    }, [results, selectedQuiz, selectedStudent]);

    const handleQuizChange = (event) => {
        const quizName = event.target.value === 'all' ? null : event.target.value;
        setSelectedQuiz(quizName);
    };

    // Handler for student selection
    const handleStudentChange = (event) => {
        const studentFname = event.target.value === 'all' ? null : event.target.value;
        setSelectedStudent(studentFname);
    };

    return (
        <>
            <div >
                <Header />
                <div style={{ padding: '20px', paddingTop:'85px' , paddingBottom:'40px', backgroundColor: 'rgb(118 192 137)' }}>

                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px', marginRight: '30px' }}>
                        <Button style={{ backgroundColor: '#910d8f', borderColor: 'purple', fontSize: "medium" }} onClick={() => navigate(`/classrooms`)}>&larr; Back</Button>
                    </div>

                    <Card style={{ marginTop: '20px', marginRight: '70px', marginLeft: '70px' }}>
                        <Card.Header style={{ backgroundColor: 'navy' }} />
                        <CardBody>
                            <CardTitle>{title}</CardTitle>
                        </CardBody>
                    </Card>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px', marginRight: '70px', marginLeft: '70px', marginTop: '20px' }}>
                        <Button style={{ backgroundColor: '#910d8f', borderColor: 'purple', fontSize: "medium", color: 'white' }} onClick={openCreateModal}>+ AddQuiz</Button>
                        {/* <Button style={{ backgroundColor: '#910d8f', borderColor: 'purple', fontSize: "medium", color: 'white' }}>⚙️ Manage Students</Button> */}
                    </div>

                    <div style={{ marginLeft: '70px', marginRight: '70px', marginTop: '30px' }}>
                        <Tabs
                            defaultActiveKey="quizzes"
                            id="fill-tab-example"
                            className="mb-3"
                            fill
                            style={{ marginTop: '30px' }}
                        >
                            <Tab eventKey="quizzes" title="Quizzes">
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>Quiz ID</th>
                                            <th>Title</th>
                                            <th>Description</th>
                                            <th>Date</th>
                                            <th>Start Time</th>
                                            <th>End Time</th>
                                            <th>Timer</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quizzes.map((quiz, index) => (
                                            <tr key={index}>
                                                <td>{quiz.quiz_id}</td>
                                                <td>{quiz.title}</td>
                                                <td>{quiz.description}</td>
                                                <td>{quiz.quiz_date}</td>
                                                <td>{quiz.start_time}</td>
                                                <td>{quiz.end_time}</td>
                                                <td>{quiz.timer} sec.</td>
                                                <td>
                                                    <button
                                                        className="btn btn-light mr-4"
                                                        onClick={() => deleteQuiz(quiz.quiz_id)}
                                                        style={{ color: 'red' }}
                                                        data-toggle="tooltip"
                                                        title="Delete Quiz"
                                                    >
                                                        ❌
                                                    </button>{'  '}

                                                    <button className="btn btn-light mr-2" data-toggle="tooltip" title="Edit Quiz" onClick={() => triggerEditModal(quiz.quiz_id)}>✏️</button>
                                                    {'  '}
                                                    <Link to={`/questionform/${quiz.quiz_id}`}>
                                                        <button className="btn btn-light mr-2" data-toggle="tooltip" title="Add Question">➕</button>
                                                    </Link>{'  '}
                                                    <Link to={`/viewQuestion/${quiz.quiz_id}`}>
                                                        <button className="btn btn-light" data-toggle="tooltip" title="View Questions">👁️</button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Tab>
                            <Tab eventKey="students" title="Students">
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
                                                        onClick={() => { removeStudentFromClassroom(student.student_id) }}
                                                        className="btn btn-light mr-4"
                                                        style={{ color: 'red' }}
                                                        data-toggle="tooltip"
                                                        title="Remove Student From Classroom"
                                                    >
                                                        ❌
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Tab>
                            <Tab eventKey="report" title="Classroom Reports">
                                <Table responsive>
                                    <thead>
                                        <tr>

                                            <th>Title</th>
                                            <th>Description</th>
                                            <th>Date</th>
                                            <th>Total Participants</th>
                                            {/* <th>Accuracy</th> */}


                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quizzes.map((quiz, index) => (

                                            <tr key={index} onClick={() => navigateToQuizDetails(quiz.quiz_id, quiz.title, quiz.quiz_date, countStudentsOfClassroom)}>

                                                <td>{quiz.title}</td>
                                                <td>{quiz.description}</td>
                                                <td>{quiz.quiz_date}</td>
                                                <td>{countStudentsOfClassroom}</td>
                                                {/* <td>{quizAccuracy[quiz.quiz_id] !== undefined ? `${quizAccuracy[quiz.quiz_id].toFixed(2)}%` : ''}</td> */}

                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Tab>
                            <Tab eventKey="results" title="Results">
                                <label style={{ marginRight: '10px', marginBottom:'10px' }}>
                                    Select Quiz:
                                    <select onChange={handleQuizChange}>
                                        <option value="all">All Quizzes</option>
                                        {/* Add options for each unique quiz name in the data */}
                                        {[...new Set(results.map(result => result.name))].map(quizName => (
                                            <option key={quizName} value={quizName}>{quizName}</option>
                                        ))}
                                    </select>
                                </label>

                                <label style={{ marginLeft: '10px' , marginBottom:'10px'}}>
                                    Select Student:
                                    <select onChange={handleStudentChange}>
                                        <option value="all">All Students</option>
                                        {/* Add options for each unique student first name in the data */}
                                        {[...new Set(results.map(result => result.student_Fname))].map(studentFname => (
                                            <option key={studentFname} value={studentFname}>{studentFname}</option>
                                        ))}
                                    </select>
                                </label>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>Result ID</th>

                                            <th>Quiz ID</th>
                                            <th>Title</th>
                                            <th>Student ID</th>
                                            <th>Student FirstName</th>
                                            <th>Student LastName</th>
                                            <th>Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map(result => (
                                            <tr key={result.result_id}>
                                                <td>{result.result_id}</td>
                                                <td>{result.quiz_id}</td>
                                                <td>{result.name}</td>
                                                <td>{result.student_id}</td>
                                                <td>{result.student_Fname}</td>
                                                <td>{result.student_Lname}</td>
                                                <td>{result.score}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Tab>
                        </Tabs>
                    </div>
                </div>

                <Footer />
            </div>

            <Modal show={showCreateModal} onHide={closeCreateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter New Quiz Details</Modal.Title>
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
                                value={quizData.title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description:</label>
                            <textarea
                                className="form-control"
                                id="description"
                                name="description"
                                value={quizData.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="timer">Timer (HH:MM):</label>
                            <input
                                type="text"
                                className="form-control"
                                id="timer"
                                name="timer"
                                value={quizData.timer}
                                placeholder='HH:MM'
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="quiz_date" className="form-label">Quiz Date:</label>
                            <input
                                type="date"
                                className="form-control"
                                id="quiz_date"
                                name="quiz_date"
                                value={quizData.quiz_date}
                                onChange={handleInputChange}
                            />
                        </div>


                        <div className="form-group">
                            <label htmlFor="start_time" className="form-label">Start Time:</label>
                            <input
                                type="time"
                                step="1"
                                className="form-control"
                                id="start_time"
                                name="start_time"
                                value={quizData.start_time}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="end_time" className="form-label">End Time:</label>
                            <input
                                type="time"
                                step="1"
                                className="form-control"
                                id="end_time"
                                name="end_time"
                                value={quizData.end_time}
                                onChange={handleInputChange}
                            />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeCreateModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addQuiz}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditModal} onHide={closeEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Quiz Details</Modal.Title>
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
                                value={quizData.title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description:</label>
                            <textarea
                                className="form-control"
                                id="description"
                                name="description"
                                value={quizData.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="timer">Timer (HH:MM):</label>
                            <input
                                type="text"
                                className="form-control"
                                id="timer"
                                name="timer"
                                value={quizData.timer}
                                placeholder='HH:MM'
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="quiz_date" className="form-label">Quiz Date:</label>
                            <input
                                type="date"
                                className="form-control"
                                id="quiz_date"
                                name="quiz_date"
                                value={quizData.quiz_date}
                                onChange={handleInputChange}
                            />
                        </div>


                        <div className="form-group">
                            <label htmlFor="start_time" className="form-label">Start Time:</label>
                            <input
                                type="time"
                                step="1"
                                className="form-control"
                                id="start_time"
                                name="start_time"
                                value={quizData.start_time}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="end_time" className="form-label">End Time:</label>
                            <input
                                type="time"
                                step="1"
                                className="form-control"
                                id="end_time"
                                name="end_time"
                                value={quizData.end_time}
                                onChange={handleInputChange}
                            />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeEditModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={editQuiz}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>


        </>
    )
}

export default ManageClassroom