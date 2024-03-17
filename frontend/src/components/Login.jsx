import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import 'react-toastify/dist/ReactToastify.css';
import data, { answers } from './data'; // Adjust the path accordingly

const Login = () => {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [userAnswer, setUserAnswer] = useState('');

  useEffect(() => {
    // Get a random question from the data array
    const randomQuestion = data[Math.floor(Math.random() * data.length)];
    setCurrentQuestion(randomQuestion);
  }, []);

  const handlesubmit = (e) => {
    e.preventDefault();

    // Check if the user's answer is correct
    const correctAnswer = answers[currentQuestion.id - 1];
    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      // Assuming your server returns a data object with the questions and answers
      axios.post('http://localhost:3001/login', { email, password })
        .then((result) => {
          if (result.data.status === 'success') {
            setTimeout(() => {
              window.location.href = '/';
            }, 1500);
          }
        })
        .catch((err) => console.log(err));
    } else {
      // Handle incorrect answer if needed
      console.log('Incorrect answer. Please try again.');
    }
  };

  return (
    <>
      <div className="signup_container">
        <div className="sign">
          <h2 className="login">Login</h2>
          <form onSubmit={handlesubmit}>
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <br />
              <br />
              <input
                className="input"
                type="email"
                placeholder="enter email"
                onChange={(e) => setemail(e.target.value)}
              />
              <br />
              <br />
            </div>

            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <br />
              <input
                className="input"
                type="password"
                placeholder="enter password"
                onChange={(e) => setpassword(e.target.value)}
              />
            </div>

            {/* Displaying a random question from data.js */}
            <div className="question-card">
              <img src={currentQuestion.image} alt={`Question ${currentQuestion.id}`} />
              <p>{currentQuestion.question}</p>
              <input
                type="text"
                placeholder="Your answer"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
              />
            </div>

            <button className="signup_btn">Login</button>
          </form>

          <br></br>
          <p className="p">Already have an account?</p>
          <Link to="/Register">
            <button className="signup_btn">Sign up</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
