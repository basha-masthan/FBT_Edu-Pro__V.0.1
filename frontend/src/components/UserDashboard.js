import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseAPI, progressAPI, userAPI } from '../services/api';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [detailedProgress, setDetailedProgress] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, coursesRes] = await Promise.all([userAPI.getMe(), courseAPI.getCourses()]);
        const enrolledCourseIds = userRes.data.enrolledCourses?.map(c => c._id) || [];
        const coursesWithStatus = coursesRes.data.map(course => ({
          ...course,
          isEnrolled: enrolledCourseIds.includes(course._id)
        }));
        setCourses(coursesWithStatus);

        // Load detailed progress from API
        const loadedProgress = {};
        for (const course of coursesWithStatus.filter(c => c.isEnrolled)) {
          try {
            const progRes = await progressAPI.getProgress(course._id);
            loadedProgress[course._id] = progRes.data || { progressPercentage: 0, completedLessons: [], completedModules: [] };
          } catch (err) {
            loadedProgress[course._id] = { progressPercentage: 0, completedLessons: [], completedModules: [] };
          }
        }
        setDetailedProgress(loadedProgress);
      } catch (err) {
        console.error('Failed to fetch data');
      }
    };
    fetchData();
  }, []);

  const enrollInCourse = async (courseId) => {
    try {
      await userAPI.enrollInCourse(courseId);
      // Refetch user data
      const userRes = await userAPI.getMe();
      const enrolledCourseIds = userRes.data.enrolledCourses?.map(c => c._id) || [];
      setCourses(prev => prev.map(course => ({
        ...course,
        isEnrolled: enrolledCourseIds.includes(course._id)
      })));
      alert('Successfully enrolled in course!');
    } catch (err) {
      console.error('Enrollment error:', err);
      if (err.response?.status === 401) {
        alert('Please log in to enroll in courses');
        navigate('/login');
      } else if (err.response?.status === 404) {
        alert('Course not found or user not found. Please try logging in again.');
        navigate('/login');
      } else {
        alert(`Failed to enroll in course: ${err.response?.data?.msg || 'Unknown error'}`);
      }
    }
  };


  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4 text-blue-900">Welcome to Your Dashboard</h2>
              <div className="row mb-4">
                <div className="col-md-4">
                  <div className="card bg-primary text-white">
                    <div className="card-body text-center">
                      <h5>Enrolled Courses</h5>
                      <h3>{courses.filter(c => c.isEnrolled).length}</h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-success text-white">
                    <div className="card-body text-center">
                      <h5>Completed</h5>
                      <h3>{courses.filter(c => c.isEnrolled && (detailedProgress[c._id]?.progressPercentage || 0) === 100).length}</h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-info text-white">
                    <div className="card-body text-center">
                      <h5>Average Progress</h5>
                      <h3>{courses.filter(c => c.isEnrolled).length > 0 ? Math.round(courses.filter(c => c.isEnrolled).reduce((acc, c) => acc + (detailedProgress[c._id]?.progressPercentage || 0), 0) / courses.filter(c => c.isEnrolled).length) : 0}%</h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <h3 className="mb-3">Your Courses</h3>
                  <div className="row g-4">
                    {courses.map(course => (
                      <div key={course._id} className="col-lg-4 col-md-6">
                        <div className="card h-100 border-0 shadow-sm">
                          <img src={course.image} className="card-img-top" alt={course.title} style={{height: '200px', objectFit: 'cover'}} />
                          <div className="card-body d-flex flex-column">
                            <h5 className="card-title">{course.title}</h5>
                            <p className="card-text flex-grow-1">{course.description}</p>
                            <div className="mb-2">
                              <span className="badge bg-primary me-2">{course.duration}</span>
                              <span className="badge bg-success">₹{course.price}</span>
                            </div>
                            {course.isEnrolled && (
                              <div className="progress mb-3">
                                <div className="progress-bar" role="progressbar" style={{width: `${detailedProgress[course._id]?.progressPercentage || 0}%`}} aria-valuenow={detailedProgress[course._id]?.progressPercentage || 0} aria-valuemin="0" aria-valuemax="100"></div>
                              </div>
                            )}
                            <div className="d-flex gap-2 mt-auto">
                              {course.isEnrolled ? (
                                <Link to={`/course/${course._id}`} className="btn btn-info">
                                  Start Learning
                                </Link>
                              ) : (
                                <button
                                  onClick={() => enrollInCourse(course._id)}
                                  className="btn btn-primary"
                                >
                                  Enroll Now
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-md-12">
                  <h3 className="mb-3">Lesson-wise Progress</h3>
                  <div className="accordion" id="progressAccordion">
                    {courses.filter(course => course.isEnrolled).map(course => (
                      <div key={course._id} className="accordion-item">
                        <h2 className="accordion-header" id={`heading${course._id}`}>
                          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${course._id}`} aria-expanded="true" aria-controls={`collapse${course._id}`}>
                            {course.title} - {detailedProgress[course._id]?.progressPercentage || 0}% Complete
                          </button>
                        </h2>
                        <div id={`collapse${course._id}`} className="accordion-collapse collapse show" aria-labelledby={`heading${course._id}`} data-bs-parent="#progressAccordion">
                          <div className="accordion-body">
                            <div className="list-group">
                              {course.modules?.map(module => (
                                <div key={module._id} className="mb-2">
                                  <h6>{module.title} {detailedProgress[course._id]?.completedModules?.includes(module._id) ? '✓' : ''}</h6>
                                  <div className="list-group">
                                    {module.lessons.map(lesson => (
                                      <div key={lesson._id} className={`list-group-item ${detailedProgress[course._id]?.completedLessons?.includes(lesson._id) ? 'list-group-item-success' : ''}`}>
                                        {lesson.title} ({lesson.duration} min) {detailedProgress[course._id]?.completedLessons?.includes(lesson._id) ? '✓ Completed' : '⏳ In Progress'}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )) || <p>No modules available</p>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;