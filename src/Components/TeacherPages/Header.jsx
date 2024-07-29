import React from 'react'
import Quizziz_Logo from '../../assets/Quizziz_Logo.png'
import { Link } from 'react-router-dom';
import { useTeacherContext } from '../context/TeacherContext';
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous"></link>

const Header = (props) => {
    // const teacher_id = localStorage.getItem('teacher_ID');

    // const { teacher_id} = useTeacherContext();
    // console.log("Teacher id is: ",teacher_id);
    // const teacher_id = props.passedValue;
    // console.log(teacher_id);

    const teacher_id = localStorage.getItem('teacher_id');

    const logOut = () => {
        localStorage.removeItem("teacher_id");
    }

    return (
        
            <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top" style={{ backgroundColor: '#e3f2fd', boxShadow:'rgba(0, 0, 0, 0.45) 0px 25px 20px -20px' , borderBottom:'1px solid black'}}>
                <div className="container">
                    <nav class="navbar navbar-light bg-light">
                        <div class="container-fluid" style={{fontFamily:'Lucida Handwriting'}}>
                            <Link class="navbar-brand"  href="#" style={{textDecoration:'none'}}>
                                <img src={Quizziz_Logo} alt="" width="30" height="24" class="d-inline-block align-text-top" />
                                QuizQuest
                            </Link>
                        </div>
                    </nav>
                    
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 " style={{fontSize:"18px"}}> 
                            <li className="nav-item mx-3">
                                <Link className="nav-link active dropdown-show" aria-current="page" to="/viewquizzes">
                                    👁️ViewQuiz
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link active dropdown-show" aria-current="page" to={`/quizform/${teacher_id}`}>
                                    ➕AddQuiz
                                </Link>
                            </li>

                            <li className="nav-item mx-3">
                                <Link className="nav-link active dropdown-show" aria-current="page" to={`/results`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-text" viewBox="0 0 16 16">
                                        <path d="M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5M5 8a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z" />
                                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1" />
                                    </svg>
                                    Results
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link active dropdown-show" aria-current="page" to={`/classrooms`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people" viewBox="0 0 16 16">
                                        <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                                    </svg>
                                    Classrooms
                                </Link>
                            </li>
                        </ul>
                        <form className="d-flex" style={{fontFamily:'Lucida Handwriting'}}>
                            <Link to='/'>
                                <button className="btn btn-outline-success" type="submit" onClick={logOut}>Log Out</button>
                            </Link>
                        </form>
                    </div>
                </div>
            </nav>
        
    )
}

export default Header