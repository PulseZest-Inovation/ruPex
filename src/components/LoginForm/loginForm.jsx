import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../../utils/FireBaseConfig/fireBaseConfig';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useAuth } from '../../utils/Auth/AuthContext';

const LoginForm = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [userType, setUserType] = useState('buyer');
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      
      // Retrieve user type from Firestore
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      const userData = userDoc.data();
      const loggedInUserType = userData ? userData.userType : null;

      if (loggedInUserType) {
        toast.success('Login successful');
        login(loggedInUserType);
        navigate(`/${loggedInUserType}`);
      } else {
        throw new Error('User type not found');
      }
    } catch (error) {
      toast.error(`Login error: ${error.message}`);
    }
  };

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      const user = userCredential.user;

      await setDoc(doc(firestore, 'users', user.uid), {
        email: signupEmail,
        username: signupUsername,
        userType: userType,
      });

      toast.success('Signup successful');
      setIsLogin(true);
    } catch (error) {
      toast.error(`Signup error: ${error.message}`);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <ToastContainer />
        <Typography variant="h4" align="center" gutterBottom>{isLogin ? 'Login' : 'Signup'}</Typography>
        {isLogin ? (
          <>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>Login</Button>
            <Typography align="center" variant="body2" gutterBottom>Don't have an account? <span style={switchLinkStyle} onClick={() => setIsLogin(false)}>Signup</span></Typography>
          </>
        ) : (
          <>
           <div style={{ marginBottom: '10px' }}>
              <InputLabel htmlFor="user-type" style={{ marginBottom: '5px', display: 'block' }}>User Type</InputLabel>
              <FormControl fullWidth variant="outlined">
                <Select
                  id="user-type"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <MenuItem value="buyer">Buyer</MenuItem>
                  <MenuItem value="seller">Seller</MenuItem>
                </Select>
              </FormControl>
            </div>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value)}
            />
           
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />
           
            <Button variant="contained" color="primary" fullWidth onClick={handleSignup}>Signup</Button>
            <Typography align="center" variant="body2" gutterBottom>Already have an account? <span style={switchLinkStyle} onClick={() => setIsLogin(true)}>Login</span></Typography>
          </>
        )}
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
};

const formContainerStyle = {
  width: '300px',
  padding: '20px',
  backgroundColor: '#f5f5f5',
  borderRadius: '10px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const switchLinkStyle = {
  color: '#007bff',
  cursor: 'pointer',
};

export default LoginForm;
