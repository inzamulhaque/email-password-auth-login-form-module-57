import app from './firebase.init';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Button, FloatingLabel, Form } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState } from 'react';

const auth = getAuth(app);

function App() {
  const [validated, setValidated] = useState(false);

  const [signUp, setSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleNameBlur = event => {
    setName(event.target.value);
  }

  const handleEmailBlur = event => {
    setEmail(event.target.value);
  }

  const handlePasswordBlur = event => {
    setPassword(event.target.value);
  }

  const handleFormSubmit = event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/.test(password)) {
      setError("Password Should contain at least one upper case, lower case, digit, special character and Minimum eight in length");
      return;
    }

    setError("");
    if (signUp) {

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          console.log(user);
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setError(errorMessage);
          console.error(errorMessage);
        });

    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          setEmail("");
          setPassword("");
          console.log(user);
          verifyEmail();
          setUserName();
        })
        .catch(error => {
          console.error(error);
          setError(error.message);
        });
    }
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        // Email verification sent!
        // ...
        console.log("email verification sent");
      });
  }

  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name
    }).then(() => {
      console.log("updating name");
    }).catch((error) => {
      setError(error.message);
    });
  }

  const hadleSignUpChange = event => {
    setSignUp(event.target.checked);
  }

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
        console.log("reset password");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        setError(errorMessage);
        console.error(errorMessage);
      });
  }

  return (
    <div>
      <div className="signIn w-50 mt-5 mx-auto">
        <h2 className="text-primary">Sign {signUp ? "In" : "Up"}</h2>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
          {signUp || <FloatingLabel
            controlId="floatingInput"
            label="Name"
            className="mb-3"
          >
            <Form.Control onBlur={handleNameBlur} type="text" placeholder="Enter Your Name" required />
            <Form.Control.Feedback type="invalid">
              Please enter your name.
            </Form.Control.Feedback>
          </FloatingLabel>}

          <FloatingLabel
            controlId="floatingInput"
            label="Email address"
            className="mb-3"
          >
            <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter Your Email Address" required />
            <Form.Control.Feedback type="invalid">
              Please provide your email address.
            </Form.Control.Feedback>
          </FloatingLabel>
          <FloatingLabel controlId="floatingPassword" label="Password">
            <Form.Control onBlur={handlePasswordBlur} type="password" placeholder="Enter Your Password" required />
            <Form.Control.Feedback type="invalid">
              Please enter your password.
            </Form.Control.Feedback>
            {
              error ? <span className="text-danger my-2">{error}</span> : ""
            }
          </FloatingLabel>
          <Form.Group className="mb-3">
            <Form.Check
              onChange={hadleSignUpChange}
              label="I've Account"
              type="checkbox"
            />
          </Form.Group>
          <Button onClick={handlePasswordReset} variant="link">Forget Password?</Button>
          <Button variant="primary" type="submit" className="mt-2">
            Sign {signUp ? "In" : "Up"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
