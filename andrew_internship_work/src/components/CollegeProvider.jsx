import React, { createContext, useContext, useState, useEffect } from "react";
import { allColleges } from "../components/CollegeList.jsx";

const CollegeContext = createContext();

export function CollegeProvider({ children }) {
  const [myColleges, setMyColleges] = useState([]);

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem("myColleges") || "[]");
    setMyColleges(allColleges.filter((college) => ids.includes(college.id)));
  }, []);

  // Remove a college by id and update localStorage
  const removeCollege = (id) => {
    const ids = JSON.parse(localStorage.getItem("myColleges") || "[]");
    const newIds = ids.filter((collegeId) => collegeId !== id);
    localStorage.setItem("myColleges", JSON.stringify(newIds));
    setMyColleges(allColleges.filter((college) => newIds.includes(college.id)));
  };

  // Call this after adding/removing a college
  const refreshColleges = () => {
    const ids = JSON.parse(localStorage.getItem("myColleges") || "[]");
    setMyColleges(allColleges.filter((college) => ids.includes(college.id)));
  };

  return (
    <CollegeContext.Provider value={{ myColleges, removeCollege, refreshColleges }}>
      {children}
    </CollegeContext.Provider>
  );
}

export function useCollegeList() {
  return useContext(CollegeContext);
}