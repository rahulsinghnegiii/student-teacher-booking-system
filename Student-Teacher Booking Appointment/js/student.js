import { auth } from "./firebase-config.js"; // Import auth for user state
import { db } from "./firebase-config.js";
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Book an appointment
export async function bookAppointment(teacherId, appointmentDate) {
    const user = auth.currentUser; // Get the current user
    if (!user) {
        throw new Error("User is not authenticated");
    }

    const studentId = user.uid; // Use the current user's ID
    const appointmentsCollection = collection(db, "appointments");
    const appointmentData = {
        studentId: studentId,
        teacherId: teacherId,
        date: appointmentDate,
        status: 'pending' // You can set a default status
    };
    
    const docRef = await addDoc(appointmentsCollection, appointmentData);
    return docRef.id; // Return the new appointment ID
}
