import React, { useState } from 'react'
import { auth, db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function SignUp() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, {
                displayName: `${firstName} ${lastName}`
            });

            const userRef = doc(db, 'users', userCredential.user.uid); 
            await setDoc(userRef, {
                firstName,
                lastName,
                email
            });

            navigate('/Login');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <section className='main-content'> 
            <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> 
                        <div className="signin"> 
                <div className="content"> 
                    <h2>Sign Up</h2> 
                    <form className="form" onSubmit={handleSignUp}> 
                        <div className="inputBox">
                            <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            <i>First Name</i>
                        </div>
                        <div className="inputBox">
                            <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            <i>Last Name</i>
                        </div>
                        <div className="inputBox"> 
                            <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)} />
                            <i>Email</i> 
                        </div> 
                        <div className="inputBox"> 
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                            <i>Password</i> 
                        </div> 
                        <div className="inputBox"> 
                            <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            <i>Confirm Password</i> 
                        </div> 
                        <div className="links">
                            <a href="/Login">Already Signed Up?</a> 
                        </div> 
                        <div className="inputBox"> 
                            <input type="submit" value="Sign Up" /> 
                        </div> 
                        {error && <p className="error-message">{error}</p>}
                    </form> 
                </div> 
            </div> 
        </section>
    );
}