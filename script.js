import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";

import {
getFirestore,
collection,
addDoc,
onSnapshot,
deleteDoc,
doc,
updateDoc
}
from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBcr7jhbR0NsEFYzVbRipBzQ-F8GrluWI8",
    authDomain: "it-grade-systems.firebaseapp.com",
    projectId: "it-grade-systems",
    storageBucket: "it-grade-systems.firebasestorage.app",
    messagingSenderId: "208414785795",
    appId: "1:208414785795:web:ba353afc01b1f19e562936"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const dbStudents = collection(db,"students");

function calculateAverage(s){
return (
Number(s.ias302)+
Number(s.sa301)+
Number(s.itelec3)+
Number(s.itelec4)+
Number(s.cap301)
)/5;
}

function getStatus(avg){

if(avg>=90) return ["Excellent","excellent"];
if(avg>=75) return ["Good","good"];
if(avg>=60) return ["Passed","good"];

return ["Failed","failed"];

}

async function addStudent(){

const name=document.getElementById("name").value.trim();

if(!name){
alert("Enter name");
return;
}

const student={

name,

ias302:Number(document.getElementById("ias302").value),
sa301:Number(document.getElementById("sa301").value),
itelec3:Number(document.getElementById("itelec3").value),
itelec4:Number(document.getElementById("itelec4").value),
cap301:Number(document.getElementById("cap301").value)

};

await addDoc(dbStudents,student);

clearForm();

}

function clearForm(){

document.querySelectorAll(".add-student input").forEach(i=>i.value="");

}

async function deleteStudent(id){

await deleteDoc(doc(db,"students",id));

}

async function editStudent(id){

const newIAS=prompt("IAS302");
const newSA=prompt("SA301");
const newIT3=prompt("ITELEC3");
const newIT4=prompt("ITELEC4");
const newCAP=prompt("CAP301");

await updateDoc(doc(db,"students",id),{

ias302:Number(newIAS),
sa301:Number(newSA),
itelec3:Number(newIT3),
itelec4:Number(newIT4),
cap301:Number(newCAP)

});

}

function renderTable(students){

const table=document.getElementById("tableBody");

table.innerHTML="";

let total=0;
let passed=0;
let failed=0;

students.sort((a,b)=>calculateAverage(b)-calculateAverage(a));

let top=students[0];

students.forEach(s=>{

const avg=calculateAverage(s);
total+=avg;

if(avg>=60) passed++;
else failed++;

const status=getStatus(avg);

table.innerHTML+=`

<tr>

<td>${s.name}</td>
<td>${s.ias302}</td>
<td>${s.sa301}</td>
<td>${s.itelec3}</td>
<td>${s.itelec4}</td>
<td>${s.cap301}</td>

<td>${avg.toFixed(2)}</td>

<td class="${status[1]}">${status[0]}</td>

<td>

<button onclick="editStudent('${s.id}')">Edit</button>
<button onclick="deleteStudent('${s.id}')">Delete</button>

</td>

</tr>

`;

});

updateStats(students,total,top,passed,failed);

}

function updateStats(students,total,top,passed,failed){

document.getElementById("totalStudents").innerText=students.length;

if(students.length===0){
document.getElementById("classAverage").innerText=0;
document.getElementById("topStudent").innerText="None";
return;
}

document.getElementById("classAverage").innerText=(total/students.length).toFixed(2);

document.getElementById("topStudent").innerText=top.name;

document.getElementById("passedCount").innerText=passed;

document.getElementById("failedCount").innerText=failed;

}

onSnapshot(dbStudents,snapshot=>{

const students=[];

snapshot.forEach(docItem=>{

const data=docItem.data();
data.id=docItem.id;

students.push(data);

});

renderTable(students);

});

window.addStudent=addStudent;
window.deleteStudent=deleteStudent;
window.editStudent=editStudent;

function exportCSV(){

let rows=document.querySelectorAll("table tr");
let csv=[];

rows.forEach(row=>{

let cols=row.querySelectorAll("td,th");
let data=[];

cols.forEach(col=>data.push(col.innerText));

csv.push(data.join(","));

});

let file=new Blob([csv.join("\n")],{type:"text/csv"});

let a=document.createElement("a");

a.href=URL.createObjectURL(file);
a.download="StudentGrades.csv";

a.click();

}

document.getElementById("searchStudent").addEventListener("keyup",function(){

let value=this.value.toLowerCase();

let rows=document.querySelectorAll("#tableBody tr");

rows.forEach(row=>{

let name=row.children[0].innerText.toLowerCase();

row.style.display=name.includes(value)?"":"none";

});

});