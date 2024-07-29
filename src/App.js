// import logo from './logo.svg';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';

import QuizForm from './Components/TeacherPages/QuizForm';
import TeacherLogin from './Components/TeacherPages/TeacherLogin';
import ViewQuizzes from './Components/TeacherPages/ViewQuizzes';
import QuestionForm from './Components/TeacherPages/QuestionForm';
import Header from './Components/TeacherPages/Header';
import Footer from './Components/Footer';
import ViewQuestions from './Components/TeacherPages/ViewQuestions';
import AttempQuiz from './Components/StudentPages/AttempQuiz';
import ViewQuizzesToStudents from './Components/StudentPages/ViewQuizzesToStudents';
import Dashboard from './Components/Dashboard';
import StudentLogin from './Components/StudentPages/StudentLogin';
import { useState } from 'react';
import { TeacherProvider } from './Components/context/TeacherContext';
import UpdateQuiz from './Components/TeacherPages/UpdateQuiz';
import UpdateQuestion from './Components/TeacherPages/UpdateQuestion';
import Results from './Components/TeacherPages/Results';
import Classrooms from './Components/TeacherPages/Classrooms';
import ManageClassroom from './Components/TeacherPages/ManageClassroom';
import StudentClassrooms from './Components/StudentPages/StudentClassrooms';
import ClassroomQuizzes from './Components/StudentPages/ClassroomQuizzes';
import QuizReports from './Components/TeacherPages/QuizReports';



function App() {
  // const [userType, setUserType] = useState(null); // null for initial state, 'teacher' or 'student' for user type
  // const navigate = useNavigate();

  // const handleUserLogin = (type) => {
  //   setUserType(type);
  //   navigate('/');
  // };
  return (
    <div className='App'>
      <BrowserRouter>
        
        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route path="/teacher" element={<TeacherLogin />} />
          <Route path="/quizform/:teacher_id" element={<QuizForm />} />
          <Route path="/viewquizzes" element={<ViewQuizzes />} />
          <Route path="/viewQuestion/:quizID" element={<ViewQuestions />} />
          <Route path="/questionform/:quizID" element={<QuestionForm />} />
          <Route path="/updateQuiz/:quiz_ID" element={<UpdateQuiz />} />
          <Route path="/updateQuestion/:question_ID" element={<UpdateQuestion/>}/>
          <Route path="/results" element={<Results/>}/>
          <Route path="/classrooms" element={<Classrooms/>} />
          <Route path="/manageClassroom/:title/:classroom_id"  element={<ManageClassroom/>}/>
          <Route path="/QuizReport/:classroom_id/:quiz_id/:quiz_title/:quiz_date/:countStudentsOfClassroom" element={<QuizReports/>}/>

          <Route path="/student" element={<StudentLogin />} />
          <Route path='/attemptQuiz/:student_id/:quizID/:title/:timeInSeconds' element={<AttempQuiz />} />
          <Route path="/viewQuizzesToStudents/:student_id" element={<ViewQuizzesToStudents />} />
          <Route path="/studentClassrooms" element={<StudentClassrooms />}/>
          <Route path="/classroomQuizzes/:title/:classroom_id" element={<ClassroomQuizzes/>} />
        </Routes>
        

      </BrowserRouter>
    </div>



  );
}

export default App;
