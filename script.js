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
  students.push(student);
  addStudentToTable(student);
  

  this.reset();
});

const tableBody=document.querySelector("#studentTable tbody");
function addStudentToTable(student){
  const row=document.createElement("tr");
  row.innerHTML=`
    <td>${student.name}</td>
    <td>${student.lastName}</td>
    <td>${student.grade}</td>
    <td>
      <button class = "delete">Eliminar</button>
      <button class = "modify">Modificar</button>
    </td>
  `;

  row.querySelector(".delete").addEventListener("click",function(){
    deleteEstudiante(student,row);  
  })

  tableBody.appendChild(row);
  calcularPromedio();
}

const averageDiv = document.getElementById("average");

function calcularPromedio(){
  notas = []
  if (students.length ===0){
    averageDiv.textContent="Promedio de Calificaciones: N/A";
    return;
  }
  
  for (let alumno of students){
    notas.push(parseFloat(alumno.grade));
  }
  
  const suma = notas.reduce((acu, valorAct) => acu+ valorAct,0);

  var promedio = suma/students.length;
  document.querySelector("#average h3").textContent=`Promedio de Calificaciones: ${promedio.toFixed(2)}`
}

function deleteEstudiante(student,row){
  const index = students.indexOf(student);
  if(index > -1){
    students.splice(index,1);
    row.remove();
    calcularPromedio()
  }
}