const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");
const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
const teamArray = [];
  function promptUserEngineer() {
    inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "What is the engineer's name?"
      },
      { 
        type: "input",
        name: "id",
        message: "What is the engineer's ID?"
      },
      {
        type: "input",
        name: "email",
        message: "What is the engineer's email?"
      },
      {
        type: "input",
        name: "github",
        message: "What is the engineer's GitHub profile?"
      }
    ]).then((res)=>{
    const engineer = new Engineer(res.name, res.id, res.email, res.github);
    teamArray.push(engineer);
    inquirer.prompt([
      {
          type: "confirm",
          name: "moreTeam",
          message: "Are there more team members?",
          default: true
      }
    ]).then(res => {
      if(res.moreTeam){
         promptUserOther(); 
      }else{
        const htmlFile = render(teamArray);
        fs.writeFileSync(outputPath, htmlFile, function(er){
          console.log(er);
        });
      }
    })
    })
  }

  const promptUserEngineerAsync = util.promisify(promptUserEngineer);

  function promptUserIntern() {
    inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "What is the intern's name?"
      },
      { 
        type: "input",
        name: "id",
        message: "What is the intern's ID?"
      },
      {
        type: "input",
        name: "email",
        message: "What is the intern's email?"
      },
      {
        type: "input",
        name: "school",
        message: "What is the intern's school?"
      }
    ]).then((res)=>{
    const intern = new Intern(res.name, res.id, res.email, res.school);
    teamArray.push(intern);
    inquirer.prompt([
      {
          type: "confirm",
          name: "moreTeam",
          message: "Are there more team members?",
          default: true
      }
    ]).then(res => {
        if(res.moreTeam){
           promptUserOther(); 
        }else{
          const htmlFile = render(teamArray);
          fs.writeFileSync(outputPath, htmlFile, function(er){
            console.log(er);
          });
        }
      })
    })
  }

  const promptUserInternAsync = util.promisify(promptUserIntern);

  function promptUserTeam(){
    inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "What is the manager's name?"
        },
        { 
          type: "input",
          name: "id",
          message: "What is the manager's ID?"
        },
        {
          type: "input",
          name: "email",
          message: "What is the manager's email?"
        },
        {
          type: "input",
          name: "officeNumber",
          message: "What is the manager's office number?"
        }
      ]).then((res)=>{
          const manager = new Manager(res.name, res.id, res.email, res.officeNumber);
          teamArray.push(manager);
          promptUserOther();
    })
  }

  const promptUserOther = async ()=>{
    await inquirer.prompt([
      {
          type: "list",
          name: "employeeType",
          message: "Is the next team member an intern or engineer?",
          choices: ["Engineer", "Intern"]
      }
    ]).then(async (empType)=>{
      if(empType.employeeType === "Engineer"){
        await promptUserEngineerAsync()
      }else{
        await promptUserInternAsync()
      }
    })
  }

  promptUserTeam();


