const expenses = document.getElementById("expenses");
const total = document.getElementById("total");
const tbody = document.getElementById("tbody");

var teamsExpList = JSON.parse(localStorage.getItem("teamsExpList")); // all teams objects
displayExp(teamsExpList);

// Function to refresh the expense tracker
function refreshExpenseTracker() {
  localStorage.removeItem("teamsExpList");
  teamsExpList = [];
  // Clear the total expenses and individual team expenses
  expenses.innerHTML = "";
  total.innerHTML = "";
  displayExp(teamsExpList);
}

function deleteTeamPlan(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "Are you want to delete this Team plan? You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      teamsExpList = teamsExpList.filter((team) => team.id !== id);
      localStorage.setItem("teamsExpList", JSON.stringify(teamsExpList));
      displayExp(teamsExpList); // Update the display after deletion
      Swal.fire("Deleted!", "Team plan has been deleted.", "success");
    }
  });
}

function displayExp(teamsExpList) {
  tbody.innerHTML = null;
  for (i = 0; i < teamsExpList.length; i++) {
    const team = teamsExpList[i];
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${team.teamName}</td>
        <td>${team.projID}</td>
        <td>${team.teamMembers}</td>
        <td>${team.mngrID}</td>
        <td>$ ${team.expensesAmount}</td>
        <td>${team.expensesDate}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteTeamPlan(${team.id})">Delete</button>
        </td>
      `;
    tbody.appendChild(tr);
  }

  calcTeamExpenses(); // Calculate each team's expenses
  calcAllExpenses(); // Calculate the total expenses for all teams
}

function calcTeamExpenses() {
  let teamName = []; //array of teams names
  let teamList = []; //array of the related team's objects

  //extarct teamNames from each object in the array
  for (const item of teamsExpList) {
    teamName.push(item.teamName);
    // console.log(teamName);
  }

  //array of teams names with no duplication
  var unique = [...new Set(teamName)];
  // console.log(unique);

  //loop through the unique team names and make array of related objects, then calculate the total expences for each team individualy
  for (i = 0; i < unique.length; i++) {
    teamList = teamsExpList.filter((team) => team.teamName === unique[i]);
    // console.log(teamList);
    calcExpensesforEachTeam(teamList);
  }
}

function calcExpensesforEachTeam(teamList) {
  let teamTotalExp = 0;
  for (var a of teamList) {
    // console.log(a);
    teamTotalExp += Number(a.expensesAmount);
    // console.log(teamTotalExp);
  }
  expenses.innerHTML += `<li style="color: #12637c;"> Annual budget for ${a.teamName} Team: <span style="color: #12277c;">$ ${teamTotalExp} </span> </li>`;
}

function calcAllExpenses() {
  let totalExp = 0;
  for (var a of teamsExpList) {
    totalExp += Number(a.expensesAmount);
  }
  total.innerHTML += ` <span style="color: #12277c;"> $ ${totalExp}</span>`;
}
