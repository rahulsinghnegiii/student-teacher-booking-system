import { db } from "../js/firebase-config.js";
import { collection, addDoc, getDocs, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Add Teacher Functionality
document.getElementById("addTeacherForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("teacherName").value;
    const department = document.getElementById("teacherDepartment").value;
    const subject = document.getElementById("teacherSubject").value;

    try {
        await addDoc(collection(db, "teachers"), {
            name: name,
            department: department,
            subject: subject
        });
        alert("Teacher added successfully!");
        loadTeachers(); // Refresh the teacher list
        document.getElementById("addTeacherForm").reset(); // Clear the form
    } catch (error) {
        console.error("Error adding teacher: ", error);
    }
});

// Load Teachers
async function loadTeachers() {
    const teachersList = document.getElementById("teachersList");
    teachersList.innerHTML = ""; // Clear the list

    const teachersRef = collection(db, "teachers");
    const snapshot = await getDocs(teachersRef);
    snapshot.forEach(doc => {
        const teacher = doc.data();
        const listItem = document.createElement("li");
        listItem.textContent = `${teacher.name} (${teacher.department}, ${teacher.subject})`;

        // Add delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", async () => {
            await deleteDoc(doc.ref);
            alert("Teacher deleted successfully!");
            loadTeachers(); // Refresh the teacher list
        });

        // Add update button
        const updateButton = document.createElement("button");
        updateButton.textContent = "Update";
        updateButton.addEventListener("click", async () => {
            const updatedName = prompt("Enter new name:", teacher.name) || teacher.name;
            const updatedDepartment = prompt("Enter new department:", teacher.department) || teacher.department;
            const updatedSubject = prompt("Enter new subject:", teacher.subject) || teacher.subject;

            await updateDoc(doc.ref, {
                name: updatedName,
                department: updatedDepartment,
                subject: updatedSubject
            });
            alert("Teacher updated successfully!");
            loadTeachers(); // Refresh the teacher list
        });

        listItem.appendChild(updateButton);
        listItem.appendChild(deleteButton);
        teachersList.appendChild(listItem);
    });
}

// Load Teachers on page load
loadTeachers();
