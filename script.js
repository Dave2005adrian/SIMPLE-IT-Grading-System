

let students = [];

function calculateAverage(s){

return (
Number(s.ias302) +
Number(s.sa301) +
Number(s.itelec3) +
Number(s.itelec4) +
Number(s.cap301)
)/5;

}


function getStatus(avg) {
  if(avg >= 90) return ["Excellent","excellent"];
  if(avg >= 75) return ["Good","good"];
  if(avg >= 60) return ["Passed","good"];
  return ["Failed","failed"];
}


function addStudent(){

let student = {

name:document.getElementById("name").value,
ias302:document.getElementById("ias302").value,
sa301:document.getElementById("sa301").value,
itelec3:document.getElementById("itelec3").value,
itelec4:document.getElementById("itelec4").value,
cap301:document.getElementById("cap301").value

};

students.push(student);

renderTable();
updateStats();
clearForm();

}


function renderTable(){

let table = document.getElementById("tableBody");

table.innerHTML="";

students.forEach((s,index)=>{

let avg = calculateAverage(s);
let status = getStatus(avg);

table.innerHTML += `

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
<button onclick="deleteStudent(${index})">Delete</button>
</td>

</tr>

`;

});

}


function deleteStudent(i){

students.splice(i,1);

renderTable();
updateStats();

}


function updateStats(){

  document.getElementById("totalStudents").innerText = students.length;

  if(students.length === 0){
    document.getElementById("classAverage").innerText = 0;
    document.getElementById("topStudent").innerText = "None";
    return;
  }

  let total = 0;
  let top = students[0];
  let topAvg = calculateAverage(top);

  students.forEach(s=>{
    let avg = calculateAverage(s);
    total += avg;

    if(avg > topAvg){       // <-- changed from < to >
      topAvg = avg;
      top = s;
    }
  });

  document.getElementById("classAverage").innerText = (total/students.length).toFixed(2);
  document.getElementById("topStudent").innerText = top.name;

}


function clearForm(){

document.getElementById("name").value="";
document.getElementById("ias302").value="";
document.getElementById("sa301").value="";
document.getElementById("itelec3").value="";
document.getElementById("itelec4").value="";
document.getElementById("cap301").value="";

}