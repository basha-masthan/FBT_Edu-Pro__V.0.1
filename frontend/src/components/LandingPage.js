import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseAPI, userAPI } from '../services/api';
import { useAuth } from '../App';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = !!user;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseAPI.getCourses();
        setCourses(res.data.slice(0, 6)); // Show first 6 courses
      } catch (err) {
        console.error('Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    if (isLoggedIn) {
      try {
        await userAPI.enrollInCourse(courseId);
        navigate('/dashboard');
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
    } else {
      navigate(`/login?redirect=/course/${courseId}`);
    }
  };

  return (
    <>
      <style>{`
        .landing-navbar {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .landing-navbar.scrolled {
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }

        .navbar-brand {
          font-weight: bold;
          font-size: 1.5rem;
          color: #1e3a8a !important;
        }

        .nav-link {
          color: #6b7280 !important;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: #1e3a8a !important;
        }

        .btn-login {
          background: linear-gradient(45deg, #1e3a8a, #3b82f6);
          border: none;
          color: white;
          padding: 8px 20px;
          border-radius: 25px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-login:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(30, 58, 138, 0.3);
        }

        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding-top: 100px;
          padding-bottom: 80px;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%23ffffff" stop-opacity="0.1"/><stop offset="100%" stop-color="%23ffffff" stop-opacity="0"/></radialGradient></defs><circle cx="500" cy="500" r="400" fill="url(%23a)"/></svg>');
          opacity: 0.3;
        }

        .course-card {
          transition: all 0.3s ease;
          border-radius: 15px;
          overflow: hidden;
        }

        .course-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .footer {
          background: #1f2937;
          color: white;
          padding: 50px 0 20px;
        }

        .footer h5 {
          color: #3b82f6;
          font-weight: 600;
        }

        .footer-link {
          color: #9ca3af;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-link:hover {
          color: #3b82f6;
        }

        .tech-badge {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          padding: 4px 12px;
          border-radius: 15px;
          font-size: 0.8rem;
          margin: 2px;
          display: inline-block;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .floating-element {
          position: absolute;
          animation: float 6s ease-in-out infinite;
        }

        .floating-1 {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .floating-2 {
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }

        .floating-3 {
          bottom: 30%;
          left: 20%;
          animation-delay: 4s;
        }
      `}</style>

      {/* Navigation */}
      <nav className="landing-navbar navbar navbar-expand-lg navbar-light">
        <div className="container">
          <Link className="navbar-brand" to="/">Edu-Pro</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link" href="#about">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#courses">Courses</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#instructors">Instructors</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#pricing">Pricing</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">Contact</a>
              </li>
            </ul>
            <div className="d-flex">
              {isLoggedIn ? (
                <Link to="/dashboard" className="btn btn-login me-2">Dashboard</Link>
              ) : (
                <>
                  <Link to="/login" className="btn btn-login me-2">Login</Link>
                  <Link to="/register" className="btn btn-outline-primary">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section text-white position-relative">
        <div className="floating-element floating-1">
          <i className="fas fa-brain fa-3x text-white opacity-25"></i>
        </div>
        <div className="floating-element floating-2">
          <i className="fas fa-dna fa-2x text-white opacity-25"></i>
        </div>
        <div className="floating-element floating-3">
          <i className="fas fa-atom fa-2x text-white opacity-25"></i>
        </div>

        <div className="container position-relative">
          <div className="row align-items-center" style={{minHeight: '70vh'}}>
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Future-Ready Learning Platform
              </h1>
              <p className="lead mb-4">
                Master cutting-edge technologies and advance your career with our expert-led courses.
                From AI to blockchain, prepare for the technologies shaping tomorrow.
              </p>
              <div>
                <Link to="/register" className="btn btn-light btn-lg me-3 px-4 py-2">
                  Start Learning Today
                </Link>
                <Link to="/courses" className="btn btn-outline-light btn-lg px-4 py-2">
                  Browse Courses
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <img src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
                     alt="Future Technology" className="img-fluid rounded shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold text-primary mb-4">About Edu-Pro</h2>
              <p className="lead mb-4">
                Edu-Pro is your gateway to mastering future-bound technologies. We offer comprehensive courses
                designed by industry experts to prepare you for the rapidly evolving tech landscape.
              </p>
              <div className="mb-4">
                <h5>Why Choose Us?</h5>
                <ul className="list-unstyled">
                  <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Expert-led courses</li>
                  <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Hands-on projects</li>
                  <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Industry-recognized certifications</li>
                  <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Lifetime access to materials</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
                   alt="About Us" className="img-fluid rounded shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section id="instructors" className="py-5 bg-light">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="display-5 fw-bold text-primary">Meet Our Expert Instructors</h2>
              <p className="lead text-muted">Learn from industry professionals with real-world experience</p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80"
                       alt="Instructor" className="rounded-circle mb-3" style={{width: '100px', height: '100px', objectFit: 'cover'}} />
                  <h5>Dr. Sarah Johnson</h5>
                  <p className="text-muted">AI & Machine Learning Expert</p>
                  <p className="small">Former Google AI researcher with 10+ years of experience in deep learning and neural networks.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80"
                       alt="Instructor" className="rounded-circle mb-3" style={{width: '100px', height: '100px', objectFit: 'cover'}} />
                  <h5>Michael Chen</h5>
                  <p className="text-muted">Blockchain & Cryptocurrency Specialist</p>
                  <p className="small">Blockchain architect at leading fintech companies, specializing in DeFi and smart contracts.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body">
                  <img src="https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80"
                       alt="Instructor" className="rounded-circle mb-3" style={{width: '100px', height: '100px', objectFit: 'cover'}} />
                  <h5>Emily Rodriguez</h5>
                  <p className="text-muted">Cybersecurity Expert</p>
                  <p className="small">Certified ethical hacker and cybersecurity consultant with expertise in threat analysis and prevention.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80"
                       alt="Instructor" className="rounded-circle mb-3" style={{width: '100px', height: '100px', objectFit: 'cover'}} />
                  <h5>David Kim</h5>
                  <p className="text-muted">Cloud Computing Specialist</p>
                  <p className="small">AWS certified solutions architect with extensive experience in cloud migration and DevOps.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-5">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="display-5 fw-bold text-primary">Choose Your Plan</h2>
              <p className="lead text-muted">Flexible pricing options for every learner</p>
            </div>
          </div>
          <div className="row g-4 justify-content-center">
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body p-4">
                  <h5 className="card-title">Basic</h5>
                  <div className="mb-4">
                    <span className="h2 text-primary">₹999</span>
                    <span className="text-muted">/month</span>
                  </div>
                  <ul className="list-unstyled mb-4">
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Access to 5 courses</li>
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Course materials</li>
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Email support</li>
                    <li className="mb-2"><i className="fas fa-times text-muted me-2"></i>Certificates</li>
                  </ul>
                  <button className="btn btn-outline-primary w-100">Get Started</button>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm text-center border-primary">
                <div className="card-body p-4">
                  <div className="badge bg-primary mb-3">Most Popular</div>
                  <h5 className="card-title">Professional</h5>
                  <div className="mb-4">
                    <span className="h2 text-primary">₹1,999</span>
                    <span className="text-muted">/month</span>
                  </div>
                  <ul className="list-unstyled mb-4">
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Access to all courses</li>
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Course materials & projects</li>
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Priority support</li>
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Certificates</li>
                  </ul>
                  <button className="btn btn-primary w-100">Get Started</button>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body p-4">
                  <h5 className="card-title">Enterprise</h5>
                  <div className="mb-4">
                    <span className="h2 text-primary">₹4,999</span>
                    <span className="text-muted">/month</span>
                  </div>
                  <ul className="list-unstyled mb-4">
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Everything in Professional</li>
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>1-on-1 mentoring</li>
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Custom learning paths</li>
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Team collaboration tools</li>
                  </ul>
                  <button className="btn btn-outline-primary w-100">Contact Sales</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-5 bg-light">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="display-5 fw-bold text-primary">Featured Courses</h2>
              <p className="lead text-muted">Explore our most popular courses</p>
            </div>
          </div>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {courses.map((course, index) => (
                <div key={course._id} className="col-lg-4 col-md-6">
                  <div className="card h-100 border-0 shadow-sm course-card">
                    <img src={course.image} className="card-img-top" alt={course.title} style={{height: '200px', objectFit: 'cover'}} />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title fw-bold">{course.title}</h5>
                      <p className="card-text text-muted flex-grow-1">{course.description}</p>
                      <div className="mb-3">
                        <span className="badge bg-primary me-2">{course.duration}</span>
                        <span className="badge bg-success">₹{course.price}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <span className="text-muted small">View Details</span>
                        <button onClick={() => handleEnroll(course._id)} className="btn btn-primary">Enroll Now</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="display-5 fw-bold text-primary">Success Stories</h2>
              <p className="lead text-muted">Hear from our successful learners</p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <i className="fas fa-quote-left fa-2x text-primary"></i>
                  </div>
                  <p className="card-text text-muted">
                    "Edu-Pro transformed my career. The AI course helped me land a job at a top tech company with a 200% salary increase."
                  </p>
                  <div className="mt-3">
                    <strong>Sarah Chen</strong><br />
                    <small className="text-muted">AI Engineer at TechCorp</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <i className="fas fa-quote-left fa-2x text-primary"></i>
                  </div>
                  <p className="card-text text-muted">
                    "The blockchain course was exceptional. I built my own DeFi project and now consult for major financial institutions."
                  </p>
                  <div className="mt-3">
                    <strong>Marcus Rodriguez</strong><br />
                    <small className="text-muted">Blockchain Consultant</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <i className="fas fa-quote-left fa-2x text-primary"></i>
                  </div>
                  <p className="card-text text-muted">
                    "The cybersecurity program prepared me for real-world threats. I'm now leading security teams at a Fortune 500 company."
                  </p>
                  <div className="mt-3">
                    <strong>Lisa Thompson</strong><br />
                    <small className="text-muted">Chief Security Officer</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="display-5 fw-bold text-primary">Get In Touch</h2>
              <p className="lead text-muted">Have questions? We're here to help!</p>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <form>
                    <div className="mb-3">
                      <input type="text" className="form-control" placeholder="Your Name" />
                    </div>
                    <div className="mb-3">
                      <input type="email" className="form-control" placeholder="Your Email" />
                    </div>
                    <div className="mb-3">
                      <textarea className="form-control" rows="4" placeholder="Your Message"></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Send Message</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <h5>Edu-Pro</h5>
              <p>Your gateway to future technologies and career advancement.</p>
              <div className="social-links">
                <a href="#" className="text-white me-3"><i className="fab fa-facebook"></i></a>
                <a href="#" className="text-white me-3"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-white me-3"><i className="fab fa-linkedin"></i></a>
                <a href="#" className="text-white"><i className="fab fa-instagram"></i></a>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <h5>Platform</h5>
              <ul className="list-unstyled">
                <li><a href="#about" className="footer-link">About Us</a></li>
                <li><a href="#courses" className="footer-link">Browse Courses</a></li>
                <li><a href="#instructors" className="footer-link">Meet Instructors</a></li>
                <li><a href="#pricing" className="footer-link">Pricing Plans</a></li>
                <li><a href="#" className="footer-link">Success Stories</a></li>
                <li><a href="#" className="footer-link">Blog</a></li>
              </ul>
            </div>
            <div className="col-lg-3 col-md-6">
              <h5>Support & Legal</h5>
              <ul className="list-unstyled">
                <li><a href="#" className="footer-link">Help Center</a></li>
                <li><a href="#" className="footer-link">Contact Us</a></li>
                <li><a href="#" className="footer-link">Student Support</a></li>
                <li><a href="#" className="footer-link">Privacy Policy</a></li>
                <li><a href="#" className="footer-link">Terms of Service</a></li>
                <li><a href="#" className="footer-link">Cookie Policy</a></li>
                <li><a href="#" className="footer-link">Refund Policy</a></li>
              </ul>
            </div>
            <div className="col-lg-3 col-md-6">
              <h5>Company</h5>
              <ul className="list-unstyled">
                <li><a href="#" className="footer-link">Careers</a></li>
                <li><a href="#" className="footer-link">Press</a></li>
                <li><a href="#" className="footer-link">Partners</a></li>
                <li><a href="#" className="footer-link">Investors</a></li>
                <li><a href="#" className="footer-link">Affiliate Program</a></li>
              </ul>
            </div>
            <div className="col-lg-3 col-md-6">
              <h5>Technologies</h5>
              <div>
                <span className="tech-badge">AI & Machine Learning</span>
                <span className="tech-badge">Blockchain</span>
                <span className="tech-badge">Quantum Computing</span>
                <span className="tech-badge">IoT</span>
                <span className="tech-badge">Cybersecurity</span>
                <span className="tech-badge">Cloud Computing</span>
                <span className="tech-badge">Data Science</span>
                <span className="tech-badge">DevOps</span>
              </div>
              <p className="mt-3 text-muted">
                Master the technologies shaping tomorrow's world.
              </p>
            </div>
          </div>
          <hr className="my-4" />
          <div className="row align-items-center">
            <div className="col-md-4">
              <p className="mb-0">&copy; 2024 Edu-Pro. All rights reserved.</p>
            </div>
            <div className="col-md-4 text-center">
              <p className="mb-0">Empowering learners for the future of technology</p>
            </div>
            <div className="col-md-4 text-md-end">
              <div className="d-flex justify-content-end gap-3">
                <a href="#" className="footer-link">Privacy</a>
                <a href="#" className="footer-link">Terms</a>
                <a href="#" className="footer-link">Cookies</a>
                <a href="#" className="footer-link">Accessibility</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;