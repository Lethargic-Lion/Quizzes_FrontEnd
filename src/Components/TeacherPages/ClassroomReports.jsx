import axios from 'axios';
import React, { useEffect, useState } from 'react'

const ClassroomReports = () => {

    const [resultData, setResultData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = 'http://localhost:8080/result/getResultsByQuizID/';
                const response = await axios.get(url);
                setResultData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const totalScore = resultData.reduce((acc, student) => acc + student.score, 0);
    const averageScore = totalScore / resultData.length;

    const highestScore = Math.max(...resultData.map(student => student.score));
    const lowestScore = Math.min(...resultData.map(student => student.score));

    return (
        <div>
            <p>Reports</p>
            <div>
                <h2>Overall Class Performance</h2>
                <p>Average Score: {averageScore}</p>
                <p>Highest Score: {highestScore}</p>
                <p>Lowest Score: {lowestScore}</p>
            </div>
        </div>
    )
}

export default ClassroomReports