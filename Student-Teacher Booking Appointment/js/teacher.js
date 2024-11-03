// teacher.js
import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Fetch appointments for the logged-in teacher
export async function fetchTeacherAppointments(teacherId) {
    const appointmentsCollection = collection(db, "appointments");
    const appointmentsSnapshot = await getDocs(appointmentsCollection);
    const appointmentsList = appointmentsSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(appointment => appointment.teacherId === teacherId); // Filter by teacherId
    return appointmentsList; // Returns an array of appointments
}
