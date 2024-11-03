import { auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js"; 
import { db } from "./firebase-config.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Register user function
export function registerUser(email, password, role, name, department, subject) {
    return createUserWithEmailAndPassword(auth, email, password)
        .then(async userCredential => {
            const user = userCredential.user;
            console.log("User registered:", user);

            // Save user details to the main "users" collection with approval status
            await setDoc(doc(db, "users", user.uid), {
                role: role,
                email: email,
                name: name,
                department: department,
                subject: subject,
                approved: false, // Initially, users are not approved
                registrationDate: new Date().toISOString()
            });

            // Save to role-specific collection ("students" or "teachers")
            if (role === "student") {
                await setDoc(doc(db, "students", user.uid), {
                    name: name,
                    email: email,
                    department: department,
                    subject: subject,
                    approved: false,
                    registrationDate: new Date().toISOString()
                });
            } else if (role === "teacher") {
                await setDoc(doc(db, "teachers", user.uid), {
                    name: name,
                    email: email,
                    department: department,
                    subject: subject,
                    approved: false,
                    registrationDate: new Date().toISOString()
                });
            }

            return user;
        })
        .catch(error => {
            console.error("Error registering user:", error);
            throw error;
        });
}

// Login user function
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User logged in:", user);

        // Retrieve the user's document from the "users" collection
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const userRole = userData.role;

            console.log("User role:", userRole);

            // Check if the user is an admin
            if (userRole === 'admin') {
                window.location.href = "admin-dashboard.html";
            } else if (userRole === 'teacher') {
                // Redirect directly to the teacher dashboard without approval check
                window.location.href = "teacher-dashboard.html";
            } else if (userRole === 'student') {
                const isApproved = userData.approved;
                // Check if the student is approved
                if (!isApproved) {
                    alert("Your registration is pending approval by an admin.");
                    await auth.signOut();
                    return;
                }
                window.location.href = "student-dashboard.html";
            } else {
                alert("Unknown role. Please contact support.");
            }
        } else {
            alert("No user document found. Please register again.");
            console.error("No user document found for UID:", user.uid);
        }
    } catch (error) {
        console.error("Error logging in: ", error);
        alert("Login failed: " + error.message);
        throw error;
    }
}

// Check if user is authenticated and redirect accordingly
export async function checkAuthentication() {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const userRole = userData.role;

                console.log("Checking authentication for user:", user.uid);
                console.log("User role:", userRole);

                // Redirect based on user role
                if (userRole === 'admin') {
                    window.location.href = "admin-dashboard.html";
                } else if (userRole === 'teacher') {
                    window.location.href = "teacher-dashboard.html"; // Stay in the dashboard
                } else if (userRole === 'student') {
                    const isApproved = userData.approved;
                    if (isApproved) {
                        window.location.href = "student-dashboard.html"; // Stay in the dashboard
                    } else {
                        alert("Your account is not approved. Please contact an admin.");
                        await auth.signOut();
                        window.location.href = "login.html";
                    }
                } else {
                    alert("Unknown role. Please contact support.");
                    await auth.signOut();
                    window.location.href = "login.html";
                }
            } else {
                alert("No user document found. Please register again.");
                console.error("No user document found for UID:", user.uid);
                window.location.href = "login.html";
            }
        } else {
            window.location.href = "login.html";
        }
    });
}
