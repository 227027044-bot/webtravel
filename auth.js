import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

import {
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";


const registerForm = document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();

        const email = document.getElementById("email").value.trim();

        const phone = document.getElementById("phone").value.trim();

        const password = document.getElementById("password").value;

        const confirmPassword = document.getElementById("confirmPassword").value;


        if (password.length < 6) {

            alert("Password must contain at least 6 characters.");

            return;

        }


        if (password !== confirmPassword) {

            alert("Passwords do not match.");

            return;

        }


        try {

            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user = userCredential.user;


            await setDoc(doc(db, "users", user.uid), {

                fullName: fullName,

                email: email,

                phone: phone,

                createdAt: new Date()

            });


            alert("Registration successful!");

            window.location.href = "index.html";


        }

        catch(error) {

            alert(error.message);

            console.log(error);

        }

    });

}



import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";


const loginForm = document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;


        try {

            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            alert("Login successful!");

            window.location.href = "index.html";


        }

        catch(error) {

            alert("Invalid email or password.");

            console.log(error);

        }

    });

}