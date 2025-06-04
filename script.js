const students=[];

document.getElementById("studentForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const nameInput = document.getElementById("name");
  const lastNameInput = document.getElementById("lastName");
  const gradeInput = document.getElementById("grade");

  const name = nameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const grade = parseFloat(gradeInput.value).toFixed(2);

  nameInput.setCustomValidity("");
  lastNameInput.setCustomValidity("");
  gradeInput.setCustomValidity("");

  let valid = true;

  if (!name) {
    nameInput.setCustomValidity("Por favor, completa el campo 'Nombre'.");
    valid = false;
  }

  if (!lastName) {
    lastNameInput.setCustomValidity("Por favor, completa el campo 'Apellido'.");
    valid = false;
  }

  if (isNaN(grade)) {
    gradeInput.setCustomValidity("Por favor, ingresa una nota.");
    valid = false;
  } else if (grade < 1 || grade > 7) {
    gradeInput.setCustomValidity("La nota debe estar entre 1.0 y 7.0.");
    valid = false;
  }

  if (!valid) {
    this.reportValidity();
    return;
  }

  const student = { name, lastName, grade };

  if (editIndex !== null) {
    students[editIndex] = student;

    const row = tableBody.rows[editIndex];
    row.cells[0].textContent = student.name;
    row.cells[1].textContent = student.lastName;
    row.cells[2].textContent = student.grade;

    editIndex = null; 
  }
  else {
    students.push(student);
    addStudentToTable(student, students.length - 1);
  }

  this.reset();
  calcularPromedio();
  totalStudents();
  studentsToExam();
  editIndex = null;
});

const tableBody=document.querySelector("#studentTable tbody");
function addStudentToTable(student, index = students.length - 1) {
  const row = document.createElement("tr");
  row.dataset.index = index;

  row.innerHTML = `
    <td>${student.name}</td>
    <td>${student.lastName}</td>
    <td>${student.grade}</td>
    <td>
      <button class="delete">Eliminar</button>
      <button class="modify">Modificar</button>
    </td>`
  ;

  row.querySelector(".delete").addEventListener("click", function () {
    deleteEstudiante(index, row);
  });

  row.querySelector(".modify").addEventListener("click", function () {
    modifyStudent(index);
  });

  tableBody.appendChild(row);
  calcularPromedio();
}

const averageDiv = document.getElementById("average");

function calcularPromedio(){
  notas = []
  if (students.length ===0){
    document.querySelector("#average h3").textContent=`Promedio de Calificaciones: No Disponible`
    return;
  }
  
  for (let alumno of students){
    notas.push(parseFloat(alumno.grade));
  }
  
  const suma = notas.reduce((acu, valorAct) => acu+ valorAct,0);

  var promedio = suma/students.length;
  document.querySelector("#average h3").textContent=`Promedio de Calificaciones: ${promedio.toFixed(2)}`
}

function totalStudents(){
  total = students.length
  if (total ===0){
    document.querySelector("#total h3").textContent=`Total Estudiantes: No Disponible`
    return;
  }
  document.querySelector("#total h3").textContent=`Total Estudiantes: ${total}`
};

function studentsToExam(){
  notas = []
  numStudentsToExam = 0
  numStudentsOk = 0

  if (students.length ===0){
    document.querySelector("#exam h3").textContent=`Estudiantes que rinden examen: No Disponible`
    document.querySelector("#ok h3").textContent=`Estudiantes eximidos: No Disponible`
    return;
  }
  
  for (let alumno of students){
    notas.push(parseFloat(alumno.grade));
  }

  for (let grade of notas){
    if(grade < 5){
      numStudentsToExam += 1
    }
    else{
      numStudentsOk += 1
    }
  }

  document.querySelector("#exam h3").textContent=`Estudiantes que rinden examen: ${numStudentsToExam}`
  document.querySelector("#ok h3").textContent=`Estudiantes eximidos: ${numStudentsOk}`
};

function deleteEstudiante(index, row) {
  if (index > -1) {
    students.splice(index, 1);
    row.remove();
    calcularPromedio();
    totalStudents();
    studentsToExam();
  }
}

let editIndex = null;

function modifyStudent(index) {
  const student = students[index];
  document.getElementById("name").value = student.name;
  document.getElementById("lastName").value = student.lastName;
  document.getElementById("grade").value = student.grade;

  editIndex = index;
}