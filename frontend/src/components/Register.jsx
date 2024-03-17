import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import "./Register.css";

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const navigate = useNavigate(); // Get history/navigation methods

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post('http://localhost:3001/register', { username, email, password, role })
      .then((res) => {
        console.log(res);

        // Redirect based on selected role
        if (role === 'as a visitor') {
          navigate('/'); // Redirect to homepage
        } else if (role === 'as a creator') {
          navigate('/usercreate'); // Redirect to user create where user fill his details
        } else {
          console.error('Invalid role:', role);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div className="div1">
        <div className="div2">
          <h2 className="h2">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="label1">Username</label><br />
              <input
                id="username"
                className="input1"
                type="text"
                placeholder="Enter name"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="email" className="label1">Email</label><br />
              <input
                id="email"
                className="input1"
                type="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="label1">Password</label><br />
              <input
                id="password"
                className="input1"
                type="password"
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <label htmlFor="password" className="label1">Select Role</label><br />

            <div className="custom-select1">
              <select className="select1" onChange={(e) => setRole(e.target.value)}>
                <option value="" className="select-selected">Select role</option>
                <option value="as a visitor" className="select-selected">As a Visitor</option>
                <option value="as a creator" className="select-selected">As a Creator</option>
              </select>
            </div>

            <button type="submit" className="signup_btn">Sign Up</button>
          </form>

          <br />
          <p className="p1">Already have an account?</p>
          <Link to="/login" title="Go to Login page">
            <button className="signup_btn">Login</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Register;
