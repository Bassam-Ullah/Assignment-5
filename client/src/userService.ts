// import { HomePage } from "./app.js";
// import { objOfHomePage } from "./app.js";
import { ICrud } from "./Icrud.js";
import { Role, User } from "./user.js";

const Url: string = "http://localhost:5000";

export class UserService implements ICrud<User> {
  tableContainer = document.getElementById("table-container");
  users: User[] = [];
  constructor() {
    this.loadData();
  }

  async loadData() {
    let serverUsersData: any[];
    //Making a GET Request to route(=>http://localhost:5000) to get all the users
    await fetch(Url)
      .then((Response) => Response.json())
      .then((data) => (serverUsersData = data));

    // console.log("From Server side ", Object.values(serverUsersData)[0]);
    console.log(serverUsersData);

    let usersData: any[];

    // usersData = Object.values(serverUsersData)[0];
    usersData = serverUsersData;
    console.log(usersData);

    usersData.forEach((user) => {
      this.users.push(new User(user));
    });
  }

  edit(event: any): void {
    let tr = event.target.parentElement.parentElement as HTMLTableRowElement;
    tr.contentEditable = "true";

    (event.target as HTMLButtonElement).parentElement.contentEditable = "false";

    event.target.parentElement.children[0].style.display = "none";
    event.target.parentElement.children[1].style.display = "none";
    event.target.parentElement.children[2].style.display = "flex";
    event.target.parentElement.children[3].style.display = "flex";
  }

  create(item: User): void {
    console.log("create Called");

    postUser(item).then((postApiResponse) => {
      // this.users = postApiResponse.users;
      console.log("PostUser called from inside create");

      this.users = postApiResponse;
      console.log(postApiResponse);

      this.render();
    });
  }
  read(): User[] {
    return this.users;
  }

  update(event: any, item: User): void {
    event.target.parentElement.parentElement.contentEditable = "false";
    let tr = event.target.parentElement.parentElement as HTMLTableRowElement;

    let userToBeUpdated: User = {
      user_id: item.user_id,
      firstname: tr.children[0].innerHTML,
      middlename: tr.children[1].innerHTML,
      lastname: tr.children[2].innerHTML,
      user_email: tr.children[3].innerHTML,
      user_phone: tr.children[4].innerHTML,
      user_role:
        tr.children[5].innerHTML === "Super Admin"
          ? Role.SUPERADMIN
          : tr.children[5].innerHTML === "Admin"
          ? Role.ADMIN
          : Role.SUBSCRIBER,
      user_address: tr.children[6].innerHTML,
    };

    saveUser(item.user_id.toString(), userToBeUpdated).then(
      (putApiResponse) => {
        console.log(putApiResponse);

        // this.users = putApiResponse.users;
        this.users = putApiResponse;

        this.render();
      }
    );

    event.target.style.display = "none";
    event.target.parentElement.children[3].style.display = "none";
    event.target.parentElement.children[0].style.display = "flex";
    event.target.parentElement.children[1].style.display = "flex";
  }

  delete(item: User): void {
    deleteUser(item.user_id.toString())
      .then((deleteApiResponse) => {
        console.log(deleteApiResponse);

        // this.users = deleteApiResponse.users;
        this.users = deleteApiResponse;
        this.render();
      })
      .catch(() => {
        alert("Error Occured");
      });
  }

  render() {
    const usersTable = document.createElement("table");
    usersTable.innerHTML = "";

    //Creating the Header of Table
    const headRow = usersTable.insertRow(-1);
    headRow.innerHTML = `<th> First Name</th>
    <th>Middle Name</th>
    <th>Last Name</th>
    <th>Email</th>
    <th>Phone</th>
    <th>Role</th>
    <th>Adress</th>
    <th>Buttons</th>`;

    this.users.forEach((user) => {
      const row = usersTable.insertRow(-1);
      row.innerHTML = `
        <td>${user.firstname}</td>
        <td>${user.middlename}</td>
        <td>${user.lastname}</td>
        <td>${user.user_email}</td>
        <td>${user.user_phone}</td>
        <td>${user.user_role}</td>
        <td>${user.user_address}</td>
      `;

      let td = document.createElement("td");
      let button = document.createElement("button");
      button.innerHTML = "Edit";
      button.classList.add("edit-btn");
      td.appendChild(button);
      row.appendChild(td);

      button.addEventListener("click", () => {
        this.edit(event!);
      });

      button = document.createElement("button");
      button.innerHTML = "Delete";
      button.classList.add("delete-btn");
      td.appendChild(button);
      row.appendChild(td);
      button.addEventListener("click", () => {
        this.delete(user);
      });

      button = document.createElement("button");
      button.innerHTML = "Save";
      button.classList.add("save-btn");
      button.style.display = "none";
      td.appendChild(button);
      row.appendChild(td);
      button.addEventListener("click", () => {
        this.update(event, user);
      });

      button = document.createElement("button");
      button.innerHTML = "Cancel";
      button.classList.add("cancel-btn");
      button.style.display = "none";
      td.appendChild(button);
      row.appendChild(td);
      button.addEventListener("click", (event: any) => {
        event.target.style.display = "none";
        event.target.parentElement.children[2].style.display = "none";
        event.target.parentElement.children[0].style.display = "flex";
        event.target.parentElement.children[1].style.display = "flex";
        this.render();
      });
    });

    this.tableContainer.innerHTML = "";
    this.tableContainer.appendChild(usersTable);

    let addBtn = document.createElement("button") as HTMLButtonElement;
    addBtn.setAttribute("id", "add-user");
    addBtn.innerHTML = "ADD USER";
    this.tableContainer.appendChild(addBtn);
    addBtn.addEventListener("click", () => {
      addBtn.setAttribute("disabled", "true");
      this.addUser();
    });
  }

  addUser() {
    let newRow = document.createElement("tr") as HTMLTableRowElement;
    let newTd = document.createElement("td") as HTMLTableCellElement;
    let input = document.createElement("input") as HTMLInputElement;
    input.placeholder = "First Name";
    input.type = "text";

    newTd.appendChild(input);
    newRow.appendChild(newTd);

    newTd = document.createElement("td") as HTMLTableCellElement;
    input = document.createElement("input") as HTMLInputElement;
    input.placeholder = "Middle Name";
    input.type = "text";
    newTd.appendChild(input);
    newRow.appendChild(newTd);

    newTd = document.createElement("td") as HTMLTableCellElement;
    input = document.createElement("input") as HTMLInputElement;
    input.placeholder = "Last Name";
    input.type = "text";
    newTd.appendChild(input);
    newRow.appendChild(newTd);

    newTd = document.createElement("td") as HTMLTableCellElement;
    input = document.createElement("input") as HTMLInputElement;
    input.placeholder = "Email";
    input.type = "text";
    newTd.appendChild(input);
    newRow.appendChild(newTd);

    newTd = document.createElement("td") as HTMLTableCellElement;
    input = document.createElement("input") as HTMLInputElement;
    input.placeholder = "Phone";
    input.type = "text";
    newTd.appendChild(input);
    newRow.appendChild(newTd);

    newTd = document.createElement("td") as HTMLTableCellElement;
    input = document.createElement("input") as HTMLInputElement;
    input.placeholder = "Role";
    input.type = "text";
    newTd.appendChild(input);
    newRow.appendChild(newTd);

    newTd = document.createElement("td") as HTMLTableCellElement;
    input = document.createElement("input") as HTMLInputElement;
    input.placeholder = "Address";
    input.type = "text";
    newTd.appendChild(input);
    newRow.appendChild(newTd);

    newTd = document.createElement("td") as HTMLTableCellElement;
    let button = document.createElement("button") as HTMLButtonElement;
    button.innerHTML = "Save";
    button.classList.add("save-btn");
    newTd.appendChild(button);
    button.addEventListener("click", () => {
      let enteredRow = (event as any).target.parentElement
        .parentElement as HTMLTableRowElement;

      const roleInputValue = (
        enteredRow.children[5].children[0] as HTMLInputElement
      ).value;

      if (
        (enteredRow.children[0].children[0] as HTMLInputElement).value === "" ||
        (enteredRow.children[2].children[0] as HTMLInputElement).value === "" ||
        (enteredRow.children[3].children[0] as HTMLInputElement).value === "" ||
        (enteredRow.children[4].children[0] as HTMLInputElement).value === "" ||
        (enteredRow.children[5].children[0] as HTMLInputElement).value === "" ||
        (enteredRow.children[6].children[0] as HTMLInputElement).value === ""
      ) {
        alert("Please enter all details properly");
      } else if (
        (enteredRow.children[5].children[0] as HTMLInputElement).value !==
          Role.ADMIN &&
        (enteredRow.children[5].children[0] as HTMLInputElement).value !==
          Role.SUBSCRIBER &&
        (enteredRow.children[5].children[0] as HTMLInputElement).value !==
          Role.SUPERADMIN
      ) {
        alert("Please choose from [Admin, Subscriber, Super Admin] as Role");
      } else {
        console.log("user is ready to be pushed in Table");

        this.create({
          user_id: this.users.length + 1,
          firstname: (enteredRow.children[0].children[0] as HTMLInputElement)
            .value,
          middlename: (enteredRow.children[1].children[0] as HTMLInputElement)
            .value,
          lastname: (enteredRow.children[2].children[0] as HTMLInputElement)
            .value,
          user_email: (enteredRow.children[3].children[0] as HTMLInputElement)
            .value,
          user_phone: (enteredRow.children[4].children[0] as HTMLInputElement)
            .value,
          user_role:
            roleInputValue === Role.ADMIN
              ? Role.ADMIN
              : roleInputValue === Role.SUBSCRIBER
              ? Role.SUBSCRIBER
              : Role.SUPERADMIN,

          user_address: (enteredRow.children[6].children[0] as HTMLInputElement)
            .value,
        });
      }
    });

    button = document.createElement("button") as HTMLButtonElement;
    button.innerHTML = "Cancel";
    button.classList.add("cancel-btn");
    newTd.appendChild(button);
    button.addEventListener("click", () => {
      this.render();
    });

    newRow.appendChild(newTd);

    let tableBodyElement = document.getElementsByTagName(
      "tbody"
    )[0] as HTMLTableSectionElement;
    tableBodyElement.appendChild(newRow);
  }
}

async function deleteUser(id: string) {
  //Sending a DELETE Request to delete the selected User
  let response = await fetch(Url + "/" + id, {
    method: "DELETE",
  });
  let deleteApiResponse = await response.json();
  return deleteApiResponse;
}

async function saveUser(id: string, item: User) {
  //Sending a PUT Request to update the selected user
  let response = await fetch(Url + "/" + id, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(item),
  });

  let putApiResponse = await response.json();
  return putApiResponse;
}

async function postUser(item: User) {
  //Sending a POST Request to create a new User.
  let response = await fetch(Url + "/" + "user", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(item),
  });

  let postApiResponse = await response.json();
  console.log(postApiResponse);

  return postApiResponse;
}
