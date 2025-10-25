import React, { useState, useEffect } from 'react';
import { userAPI, courseAPI } from '../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', image: '', price: 0, duration: '', modules: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersRes, coursesRes] = await Promise.all([userAPI.getUsers(), courseAPI.getCourses()]);
        setUsers(usersRes.data);
        setCourses(coursesRes.data);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      await userAPI.deleteUser(id);
      setUsers(users.filter(user => user._id !== id));
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleUpdateUser = async (id, updates) => {
    try {
      const res = await userAPI.updateUser(id, updates);
      setUsers(users.map(user => user._id === id ? res.data : user));
    } catch (err) {
      setError('Failed to update user');
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await courseAPI.createCourse(newCourse);
      setCourses([...courses, res.data]);
      setNewCourse({ title: '', description: '', image: '', price: 0, duration: '', modules: [] });
    } catch (err) {
      setError('Failed to create course');
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await courseAPI.updateCourse(editingCourse._id, editingCourse);
      setCourses(courses.map(course => course._id === editingCourse._id ? res.data : course));
      setEditingCourse(null);
    } catch (err) {
      setError('Failed to update course');
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      await courseAPI.deleteCourse(id);
      setCourses(courses.filter(course => course._id !== id));
    } catch (err) {
      setError('Failed to delete course');
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
  };


  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      {error && <div className="alert alert-danger mb-4">{error}</div>}
      <div className="mb-5">
        <h3 className="mb-3">Manage Users</h3>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateUser(user._id, { role: e.target.value })}
                      className="form-select"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="btn btn-danger btn-sm me-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mb-5">
        <h3 className="mb-3">Manage Courses</h3>
        <form onSubmit={handleCreateCourse} className="mb-4 p-3 border rounded">
          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                type="text"
                placeholder="Course Title"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="url"
                placeholder="Course Image URL"
                value={newCourse.image}
                onChange={(e) => setNewCourse({ ...newCourse, image: e.target.value })}
                required
                className="form-control"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                type="number"
                placeholder="Price (₹)"
                value={newCourse.price}
                onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="text"
                placeholder="Duration (e.g., 4 months)"
                value={newCourse.duration}
                onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                required
                className="form-control"
              />
            </div>
          </div>
          <div className="mb-3">
            <textarea
              placeholder="Course Description"
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              required
              className="form-control"
              rows="3"
            />
          </div>
          <div className="mb-3">
            <h5>Modules</h5>
            {newCourse.modules.map((module, index) => (
              <div key={index} className="mb-3 p-2 border rounded">
                <input
                  type="text"
                  placeholder="Module Title"
                  value={module.title}
                  onChange={(e) => {
                    const updatedModules = [...newCourse.modules];
                    updatedModules[index].title = e.target.value;
                    setNewCourse({ ...newCourse, modules: updatedModules });
                  }}
                  className="form-control mb-2"
                />
                <h6>Lessons</h6>
                {module.lessons.map((lesson, lessonIndex) => (
                  <div key={lessonIndex} className="mb-2 p-2 border rounded">
                    <select
                      value={lesson.type}
                      onChange={(e) => {
                        const updatedModules = [...newCourse.modules];
                        updatedModules[index].lessons[lessonIndex].type = e.target.value;
                        setNewCourse({ ...newCourse, modules: updatedModules });
                      }}
                      className="form-select mb-1"
                    >
                      <option value="text">Text</option>
                      <option value="video">Video</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Lesson Title"
                      value={lesson.title}
                      onChange={(e) => {
                        const updatedModules = [...newCourse.modules];
                        updatedModules[index].lessons[lessonIndex].title = e.target.value;
                        setNewCourse({ ...newCourse, modules: updatedModules });
                      }}
                      className="form-control mb-1"
                    />
                    <input
                      type="number"
                      placeholder="Duration (minutes)"
                      value={lesson.duration}
                      onChange={(e) => {
                        const updatedModules = [...newCourse.modules];
                        updatedModules[index].lessons[lessonIndex].duration = e.target.value;
                        setNewCourse({ ...newCourse, modules: updatedModules });
                      }}
                      className="form-control mb-1"
                    />
                    {lesson.type === 'text' ? (
                      <textarea
                        placeholder="Lesson Content"
                        value={lesson.content}
                        onChange={(e) => {
                          const updatedModules = [...newCourse.modules];
                          updatedModules[index].lessons[lessonIndex].content = e.target.value;
                          setNewCourse({ ...newCourse, modules: updatedModules });
                        }}
                        className="form-control mb-1"
                        rows="3"
                      />
                    ) : (
                      <input
                        type="url"
                        placeholder="YouTube Video URL"
                        value={lesson.videoUrl || ''}
                        onChange={(e) => {
                          const updatedModules = [...newCourse.modules];
                          updatedModules[index].lessons[lessonIndex].videoUrl = e.target.value;
                          updatedModules[index].lessons[lessonIndex].content = e.target.value;
                          setNewCourse({ ...newCourse, modules: updatedModules });
                        }}
                        className="form-control mb-1"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const updatedModules = [...newCourse.modules];
                        updatedModules[index].lessons.splice(lessonIndex, 1);
                        setNewCourse({ ...newCourse, modules: updatedModules });
                      }}
                      className="btn btn-danger btn-sm"
                    >
                      Remove Lesson
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const updatedModules = [...newCourse.modules];
                    updatedModules[index].lessons.push({ type: 'text', title: '', content: '', duration: 0 });
                    setNewCourse({ ...newCourse, modules: updatedModules });
                  }}
                  className="btn btn-secondary btn-sm me-2"
                >
                  Add Lesson
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const updatedModules = [...newCourse.modules];
                    updatedModules.splice(index, 1);
                    setNewCourse({ ...newCourse, modules: updatedModules });
                  }}
                  className="btn btn-danger btn-sm"
                >
                  Remove Module
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setNewCourse({ ...newCourse, modules: [...newCourse.modules, { title: '', lessons: [] }] });
              }}
              className="btn btn-primary"
            >
              Add Module
            </button>
          </div>
          <button type="submit" className="btn btn-success">Create Course</button>
        </form>
        {editingCourse && (
          <form onSubmit={handleUpdateCourse} className="mb-4 p-3 border rounded bg-light">
            <h4 className="mb-3">Edit Course</h4>
            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  placeholder="Course Title"
                  value={editingCourse.title}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  required
                  className="form-control"
                />
              </div>
              <div className="col-md-6 mb-3">
                <input
                  type="url"
                  placeholder="Course Image URL"
                  value={editingCourse.image}
                  onChange={(e) => setEditingCourse({ ...editingCourse, image: e.target.value })}
                  required
                  className="form-control"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={editingCourse.price}
                  onChange={(e) => setEditingCourse({ ...editingCourse, price: e.target.value })}
                  required
                  className="form-control"
                />
              </div>
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  placeholder="Duration (e.g., 4 months)"
                  value={editingCourse.duration}
                  onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                  required
                  className="form-control"
                />
              </div>
            </div>
            <div className="mb-3">
              <textarea
                placeholder="Course Description"
                value={editingCourse.description}
                onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                required
                className="form-control"
                rows="3"
              />
            </div>
            <div className="mb-3">
              <h5>Modules</h5>
              {editingCourse.modules.map((module, index) => (
                <div key={index} className="mb-3 p-2 border rounded">
                  <input
                    type="text"
                    placeholder="Module Title"
                    value={module.title}
                    onChange={(e) => {
                      const updatedModules = [...editingCourse.modules];
                      updatedModules[index].title = e.target.value;
                      setEditingCourse({ ...editingCourse, modules: updatedModules });
                    }}
                    className="form-control mb-2"
                  />
                  <h6>Lessons</h6>
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="mb-2 p-2 border rounded">
                      <select
                        value={lesson.type}
                        onChange={(e) => {
                          const updatedModules = [...editingCourse.modules];
                          updatedModules[index].lessons[lessonIndex].type = e.target.value;
                          setEditingCourse({ ...editingCourse, modules: updatedModules });
                        }}
                        className="form-select mb-1"
                      >
                        <option value="text">Text</option>
                        <option value="video">Video</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Lesson Title"
                        value={lesson.title}
                        onChange={(e) => {
                          const updatedModules = [...editingCourse.modules];
                          updatedModules[index].lessons[lessonIndex].title = e.target.value;
                          setEditingCourse({ ...editingCourse, modules: updatedModules });
                        }}
                        className="form-control mb-1"
                      />
                      <input
                        type="number"
                        placeholder="Duration (minutes)"
                        value={lesson.duration}
                        onChange={(e) => {
                          const updatedModules = [...editingCourse.modules];
                          updatedModules[index].lessons[lessonIndex].duration = e.target.value;
                          setEditingCourse({ ...editingCourse, modules: updatedModules });
                        }}
                        className="form-control mb-1"
                      />
                      {lesson.type === 'text' ? (
                        <textarea
                          placeholder="Lesson Content"
                          value={lesson.content}
                          onChange={(e) => {
                            const updatedModules = [...editingCourse.modules];
                            updatedModules[index].lessons[lessonIndex].content = e.target.value;
                            setEditingCourse({ ...editingCourse, modules: updatedModules });
                          }}
                          className="form-control mb-1"
                          rows="3"
                        />
                      ) : (
                        <input
                          type="url"
                          placeholder="YouTube Video URL"
                          value={lesson.videoUrl || ''}
                          onChange={(e) => {
                            const updatedModules = [...editingCourse.modules];
                            updatedModules[index].lessons[lessonIndex].videoUrl = e.target.value;
                            updatedModules[index].lessons[lessonIndex].content = e.target.value;
                            setEditingCourse({ ...editingCourse, modules: updatedModules });
                          }}
                          className="form-control mb-1"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const updatedModules = [...editingCourse.modules];
                          updatedModules[index].lessons.splice(lessonIndex, 1);
                          setEditingCourse({ ...editingCourse, modules: updatedModules });
                        }}
                        className="btn btn-danger btn-sm"
                      >
                        Remove Lesson
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const updatedModules = [...editingCourse.modules];
                      updatedModules[index].lessons.push({ type: 'text', title: '', content: '', duration: 0 });
                      setEditingCourse({ ...editingCourse, modules: updatedModules });
                    }}
                    className="btn btn-secondary btn-sm me-2"
                  >
                    Add Lesson
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const updatedModules = [...editingCourse.modules];
                      updatedModules.splice(index, 1);
                      setEditingCourse({ ...editingCourse, modules: updatedModules });
                    }}
                    className="btn btn-danger btn-sm"
                  >
                    Remove Module
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setEditingCourse({ ...editingCourse, modules: [...editingCourse.modules, { title: '', lessons: [] }] });
                }}
                className="btn btn-primary"
              >
                Add Module
              </button>
            </div>
            <button type="submit" className="btn btn-success me-2">Update</button>
            <button type="button" onClick={() => setEditingCourse(null)} className="btn btn-secondary">Cancel</button>
          </form>
        )}
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Modules</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course._id}>
                  <td>{course.title}</td>
                  <td>{course.description}</td>
                  <td>₹{course.price}</td>
                  <td>{course.duration}</td>
                  <td>{course.modules.length} modules</td>
                  <td>
                    <button
                      onClick={() => handleEditCourse(course)}
                      className="btn btn-warning btn-sm me-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;