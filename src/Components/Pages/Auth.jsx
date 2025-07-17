import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../../firebaseConfig";
import { googleSignIn, login, signUp } from "../../AuthService";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { IoClose } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import "./Auth.css";
import { ResetPassword } from "../Layout/ResetPassword";

const Auth = ({ shouldShow, handleShow, setName }) => {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showResetPassword, setShowResetPassword] = useState(false);

    //Track Authentication State only once
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setName(currentUser.displayName || currentUser.email)
                handleShow(false);
            }
        });

        return () => unSubscribe; // cleans up the Listener when component unmounts
    }, [setName, handleShow]);


    return (
        <div>
            <Modal show={shouldShow} onHide={() => handleShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Sign in to Shoppers Stop</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {/* <span>Enter your email ID or phone number to sign in</span> */}
                        <Form.Group className="email" controlId="exapmleForm.ControlInput1">
                            {/* <Form.Label>Email</Form.Label> */}
                            <Form.Control
                                type="email"
                                placeholder="Enter your phone or email ID"
                                autoFocus
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                            />
                        </Form.Group>
                         <Form.Group className="email" controlId="exapmleForm.ControlInput1">
                            {/* <Form.Label>Password</Form.Label> */}
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                autoFocus
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                            />
                        </Form.Group> 
                    </Form>
                </Modal.Body>
                <Modal.Footer className="footer">
                    <Button variant="secondary" onClick={handleShow}>Close</Button>
                    <Button className="btn-login" 
                    onClick={() => login(email, password)}>Proceed</Button>
                    <div>
                    <span className="info-break">Or Sign in with Google</span>
                    <Button onClick={googleSignIn}><FcGoogle /></Button>
                    <div className="signup-row">
                    <h3>Dont have an account?</h3>
                    <Button variant="link" onClick={() => signUp(email, password)}>signUp</Button>
                    </div>
                    <p onClick={() => setShowResetPassword(true)} 
                    style={{cursor: 'pointer', color: 'blue'}}>
                    Forgot Password?
                    </p>

                    {showResetPassword && <ResetPassword onClose={() => setShowResetPassword(false)} />} 
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Auth;