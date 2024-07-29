import { createContext, useContext, useState } from 'react';
import Header from '../TeacherPages/Header';

const TeacherContext = createContext();

export const useTeacherContext = () => {
  return useContext(TeacherContext);
};

export const TeacherProvider = ({ children }) => {
  const [teacherId, setTeacherId] = useState(null);

  const setTeacherIdValue = (id) => {
    setTeacherId(id);
  };

  return (
    <TeacherContext.Provider value={{ teacherId, setTeacherIdValue }}>
      {children}
    </TeacherContext.Provider>
  );
};
