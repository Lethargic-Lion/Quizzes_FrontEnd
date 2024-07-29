import React from 'react'
import Quizziz_Logo from '../../assets/Quizziz_Logo.png'
import '../../Css/StudentHeader.css'
import { Link } from 'react-router-dom';

const StudentHeader = () => {
    
    const student_id = localStorage.getItem("student_id");
    const logOut = () => {
        localStorage.removeItem("student_id");
        localStorage.removeItem("lastName");
        localStorage.removeItem("firstName");
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light header fixed-top" style={{ backgroundColor: '#e3f2fd' , borderBottom:'1px solid black'}}>
                <div className="container" >
                    <nav class="navbar navbar-light bg-light" style={{fontFamily:'Lucida Handwriting'}}>
                        <div class="container-fluid">
                            <Link class="navbar-brand" href="#" style={{textDecoration:'none'}}>
                                <img src={Quizziz_Logo} alt="" width="30" height="24" class="d-inline-block align-text-top" />
                                QuizQuest
                            </Link>
                        </div>
                    </nav>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0" style={{fontSize:"18px"}}>
                            <li className="nav-item navItemText mx-3">
                                <Link className="nav-link active dropdown-show" aria-current="page" to={`/viewQuizzesToStudents/${student_id}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                                    </svg>
                                    Quizzes
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link active dropdown-show" aria-current="page" to={`/studentClassrooms`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people" viewBox="0 0 16 16">
                                        <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                                    </svg>
                                    Classrooms
                                </Link>
                            </li>

                        </ul>

                        <form className="d-flex" style={{fontFamily:'Lucida Handwriting'}}>
                            {/* <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" /> */}
                            <Link to='/'>
                                <button className="btn btn-outline-success" type="submit" onClick={logOut}>Log Out</button>
                            </Link>

                        </form>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default StudentHeader
