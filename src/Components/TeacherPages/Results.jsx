import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Header from './Header';
import Footer from '../Footer';
import { Bar } from 'react-chartjs-2';

const Results = () => {

    const [results, setResults] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [averageScore, setAverageScore] = useState(0);
    const [maxScore, setMaxScore] = useState(0);
    const [minScore, setMinScore] = useState(0);
    const [maxScoreStudentId, setMaxScoreStudentId] = useState('');
    const [minScoreStudentId, setMinScoreStudentId] = useState('');

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

    const handleSort = () => {
        // Toggle sorting order
        setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
        // Sort the results based on the score and the current sorting order
        setResults((prevResults) =>
            prevResults.slice().sort((a, b) => (sortOrder === 'asc' ? a.score - b.score : b.score - a.score))
        );
    };


    useEffect(() => {
        const scores = results.map(result => result.score);
        const totalScore = scores.reduce((acc, score) => acc + score, 0);
        console.log(totalScore);
        const newAverageScore = results.length > 0 ? totalScore / results.length : 0;
        setAverageScore(newAverageScore);

        // Find maximum and minimum scores
        const max = Math.max(...scores);
        const min = Math.min(...scores);
        setMaxScore(max);
        setMinScore(min);

        // Find student IDs corresponding to maximum and minimum scores
        const studentIdForMaxScore = results.find((result) => result.score === max)?.student_id || '';
        const studentIdForMinScore = results.find((result) => result.score === min)?.student_id || '';
        setMaxScoreStudentId(studentIdForMaxScore);
        setMinScoreStudentId(studentIdForMinScore);
    }, [results]);

    const [scoreDistribution, setScoreDistribution] = useState({});

    useEffect(() => {
        // Define the score ranges
        const scoreRanges = [
            { min: 0, max: 5 },
            { min: 6, max: 10 },
            { min: 11, max: 15 },
            // Add more ranges as needed
        ];

        // Initialize the frequency distribution object
        const distribution = {};

        // Count the occurrences in each score range
        results.forEach((result) => {
            const { score } = result;

            // Find the appropriate range for the score
            const range = scoreRanges.find((range) => score >= range.min && score <= range.max);

            // Increment the count for the range in the distribution object
            if (range) {
                const rangeKey = `${range.min}-${range.max}`;
                distribution[rangeKey] = (distribution[rangeKey] || 0) + 1;
            }
        });

        // Set the frequency distribution state
        setScoreDistribution(distribution);
    }, [results]);


    const [filteredData, setFilteredData] = useState(results);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);

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
        <div style={{ backgroundColor: 'rgb(118 192 137)' }}>
            <Header />
            <div style={{ display: 'flex', paddingTop:'85px', marginBottom: '2px', marginRight: '40px', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={handleSort}>
                    {sortOrder === 'asc' ? 'Sort by Lowest  Score' : 'Sort by Highest Score'}
                </button>
            </div>
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-md-9" style={{paddingBottom:'50px'}}>
                        <div className="container mt-2 ">
                            <h2 className="text-center mb-4">Results</h2>
                            <div style={{ marginBottom: '10px' }}>

                                <label style={{ marginRight: '10px' }}>
                                    Select Quiz:
                                    <select onChange={handleQuizChange}>
                                        <option value="all">All Quizzes</option>
                                        {/* Add options for each unique quiz name in the data */}
                                        {[...new Set(results.map(result => result.name))].map(quizName => (
                                            <option key={quizName} value={quizName}>{quizName}</option>
                                        ))}
                                    </select>
                                </label>

                                <label style={{ marginLeft: '10px' }}>
                                    Select Student:
                                    <select onChange={handleStudentChange}>
                                        <option value="all">All Students</option>
                                        {/* Add options for each unique student first name in the data */}
                                        {[...new Set(results.map(result => result.student_Fname))].map(studentFname => (
                                            <option key={studentFname} value={studentFname}>{studentFname}</option>
                                        ))}
                                    </select>
                                </label>

                            </div>
                            <table className="table table-bordered">
                                <thead className="thead-dark">
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
                            </table>
                        </div>
                        <div className='col-md-12 mt-2' style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                            <div className="card" style={{ width: '18rem' }}>
                                <div class="card-header">
                                    Overall Performance
                                </div>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">Average Score: {averageScore}</li>
                                    <li className="list-group-item">Maximum Score: {maxScore} (Student ID: {maxScoreStudentId})</li>
                                    <li className="list-group-item">Minimum Score: {minScore} (Student ID: {minScoreStudentId})</li>
                                </ul>
                            </div>
                            <div className="card" style={{ width: '18rem' }}>
                                <div className="card-header">
                                    Frequency Distribution of Scores:
                                </div>
                                <ul className="list-group list-group-flush">
                                    {Object.keys(scoreDistribution).map((range) => (
                                        <li key={range} className="list-group list-group-flush">
                                            {`${range}: ${scoreDistribution[range]} occurrences`}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>



                    </div>
                </div>
            </div>



            <Footer />
        </div>

    )
}

export default Results