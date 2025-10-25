import React, { useState, useEffect, useCallback } from 'react';
import { progressAPI, courseAPI } from '../services/api';
import { useParams, Link } from 'react-router-dom';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [currentModule, setCurrentModule] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [completedModules, setCompletedModules] = useState([]);
  const [progress, setProgress] = useState({ progressPercentage: 0, completedLessons: [], completedModules: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseRes, progressRes] = await Promise.all([
          courseAPI.getCourses(),
          progressAPI.getProgress(id)
        ]);
        const foundCourse = courseRes.data.find(c => c._id === id);
        if (!foundCourse) {
          setError('Course not found');
          return;
        }
        setCourse(foundCourse);
        if (progressRes.data) {
          setProgress(progressRes.data);
          setCompletedLessons(progressRes.data.completedLessons || []);
          setCompletedModules(progressRes.data.completedModules || []);
        }
      } catch (err) {
        setError('Failed to fetch course data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const completeLesson = useCallback(async (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      const newCompleted = [...completedLessons, lessonId];
      setCompletedLessons(newCompleted);

      const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
      const newProgress = {
        progressPercentage: Math.round((newCompleted.length / totalLessons) * 100),
        completedLessons: newCompleted,
        completedModules: completedModules
      };
      setProgress(newProgress);

      try {
        await progressAPI.markLessonCompleted(id, lessonId);
        // Refetch progress to get updated data
        const progressRes = await progressAPI.getProgress(id);
        if (progressRes.data) {
          setProgress(progressRes.data);
          setCompletedLessons(progressRes.data.completedLessons || []);
          setCompletedModules(progressRes.data.completedModules || []);
        }
      } catch (err) {
        console.error('Failed to update progress');
      }
    }
  }, [completedLessons, completedModules, course, id]);

  const canAccessLesson = (moduleIndex, lessonIndex) => {
    if (moduleIndex === 0 && lessonIndex === 0) return true;
    if (moduleIndex > 0 && !completedModules.includes(course.modules[moduleIndex - 1]._id)) return false;
    if (lessonIndex > 0 && !completedLessons.includes(course.modules[moduleIndex].lessons[lessonIndex - 1]._id)) return false;
    return true;
  };

  if (loading) return <div className="text-center p-4">Loading course...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;
  if (!course) return <div className="text-center p-4">Course not found</div>;

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>{course.title}</h2>
            <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
          </div>
          <div className="progress mb-4">
            <div className="progress-bar" role="progressbar" style={{width: `${progress.progressPercentage}%`}} aria-valuenow={progress.progressPercentage} aria-valuemin="0" aria-valuemax="100">
              {progress.progressPercentage}% Complete
            </div>
          </div>
          <div className="accordion mb-4" id="modulesAccordion">
            {course.modules.map((module, moduleIndex) => (
              <div key={module._id} className="accordion-item">
                <h2 className="accordion-header" id={`heading${moduleIndex}`}>
                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${moduleIndex}`} aria-expanded={moduleIndex === currentModule} aria-controls={`collapse${moduleIndex}`}>
                    {module.title} {completedModules.includes(module._id) ? '✓' : ''}
                  </button>
                </h2>
                <div id={`collapse${moduleIndex}`} className={`accordion-collapse collapse ${moduleIndex === currentModule ? 'show' : ''}`} aria-labelledby={`heading${moduleIndex}`} data-bs-parent="#modulesAccordion">
                  <div className="accordion-body">
                    <div className="list-group">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <button
                          key={lesson._id}
                          className={`list-group-item list-group-item-action ${moduleIndex === currentModule && lessonIndex === currentLesson ? 'active' : ''} ${completedLessons.includes(lesson._id) ? 'list-group-item-success' : ''}`}
                          onClick={() => {
                            if (canAccessLesson(moduleIndex, lessonIndex)) {
                              setCurrentModule(moduleIndex);
                              setCurrentLesson(lessonIndex);
                            }
                          }}
                          disabled={!canAccessLesson(moduleIndex, lessonIndex)}
                        >
                          {lesson.title} ({lesson.duration} min) {completedLessons.includes(lesson._id) ? '✓ Completed' : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {course.modules[currentModule] && course.modules[currentModule].lessons[currentLesson] && (
            <div>
              <h3>{course.modules[currentModule].lessons[currentLesson].title}</h3>
              <p className="text-muted mb-3">Duration: {course.modules[currentModule].lessons[currentLesson].duration} minutes</p>
              {course.modules[currentModule].lessons[currentLesson].type === 'text' ? (
                <div className="mb-4">
                  <div className="card">
                    <div className="card-body">
                      <pre style={{whiteSpace: 'pre-wrap'}}>{course.modules[currentModule].lessons[currentLesson].content}</pre>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="embed-responsive embed-responsive-16by9 mb-4">
                  <iframe
                    className="embed-responsive-item"
                    src={course.modules[currentModule].lessons[currentLesson].content}
                    allowFullScreen
                    title={course.modules[currentModule].lessons[currentLesson].title}
                  ></iframe>
                </div>
              )}
              <div className="d-flex gap-2">
                <button
                  className="btn btn-success"
                  onClick={() => completeLesson(course.modules[currentModule].lessons[currentLesson]._id)}
                >
                  Mark as Completed
                </button>
                {currentLesson < course.modules[currentModule].lessons.length - 1 && (
                  <button
                    className="btn btn-primary"
                    onClick={() => setCurrentLesson(currentLesson + 1)}
                    disabled={!completedLessons.includes(course.modules[currentModule].lessons[currentLesson]._id)}
                  >
                    Next Lesson
                  </button>
                )}
                {currentLesson === course.modules[currentModule].lessons.length - 1 && currentModule < course.modules.length - 1 && (
                  <button
                    className="btn btn-primary"
                    onClick={() => setCurrentModule(currentModule + 1)}
                    disabled={!completedLessons.includes(course.modules[currentModule].lessons[currentLesson]._id)}
                  >
                    Next Module
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Course Progress</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <strong>Overall Progress:</strong> {progress.progressPercentage}%
              </div>
              <div className="mb-3">
                <strong>Completed Lessons:</strong> {completedLessons.length}
              </div>
              <div className="mb-3">
                <strong>Completed Modules:</strong> {completedModules.length}
              </div>
              <div className="progress">
                <div className="progress-bar" role="progressbar" style={{width: `${progress.progressPercentage}%`}} aria-valuenow={progress.progressPercentage} aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;