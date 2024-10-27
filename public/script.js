const appName = document.getElementById('appName')
const firstNameInput = document.getElementById('firstname')
const lastNameInput = document.getElementById('lastname')
const ageInput = document.getElementById('age')
const addButton = document.getElementById('addButton')
const usersList = document.getElementById('usersList')

//mock data
// const usersFromData = [
//     {
//         "firstName": "John",
//         "lastName": "Doe",
//         "age": 35,
//         "id": "23232323"
//     },
//     {
//         "firstName": "Jane",
//         "lastName": "Doe",
//         "age": 30,
//         "id": "23232324"
//     },
//     {
//         "firstName": "Johnny",
//         "lastName": "Doe",
//         "age": 5,
//         "id": "23232325"
//     }
// ]
//JSON -> Object
// const storedUsers = JSON.parse(JSON.stringify(usersFromData))
let rowNumber = 1
let usersCurrent = []
let id

class User {
    constructor(firstName, lastName, age, id) {
        this.firstName = firstName
        this.lastName = lastName
        this.age = age
        this.id = id
    }
}

class UI {
    static async displayAppName() {
        try {
            appName.innerText = await AppService.getAppName()
        } catch (error) {
            console.log("Error while fetch appName")
            throw error
        }
    }

    static isFormValid() {
        const isFirstNameValid = firstNameInput.value.trim().length > 0
        const isLastNameValid = lastNameInput.value.trim().length > 0
        const isAgeValid = ageInput.value.trim().length > 0

        return isFirstNameValid && isLastNameValid && isAgeValid
    }

    static activateAddButton() {
        const isValid = UI.isFormValid()
        console.log("isValid = ", isValid)

        addButton.disabled = !isValid
    }

    static async displayUsers() {
        // const users = storedUsers //Mock data
        const users = await UserService.getUsers() //API call GET users

        if (users.length) {
            users.forEach((user) => {
                if (!usersCurrent.find((e) => e.id === user.id)) {
                    UI.addUserToList(user)
                }
            })
        }
            usersCurrent = users
    }

    static async createUser() {
        if (UI.isFormValid()) {
            const firstName = firstNameInput.value.trim()
            const lastName = lastNameInput.value.trim()
            const age = ageInput.value
            id = await UserService.postUsers(firstName, lastName, age)
        }
    }

    static addUserToList(user) {
        const row = document.createElement('tr')

        row.innerHTML = `
            <th scope="row">${rowNumber}</th>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.id}</td>
        `;

        usersList.appendChild(row)
        rowNumber++
    }

}

class AppService {
    static getAppName() {
        return fetch("http://localhost:5000/api/")
            .then(response =>{
                if (response.status !== 200) {
                    console.log("[ERROR] response status: ", response.status)
                    throw new Error('Failed to fetch appName')
                }

                return response.text()
            })
            .catch(error => {
                console.log("fetch error", error)
                throw error
            })
    }
}

class UserService {
    static getUsers() {
        return fetch("http://localhost:5000/api/users")
            .then(response => {
                if (response.status !== 200) {
                    console.error("[ERROR] Response status: ", response.status)
                    throw new Error('Failed to fetch users.')
                }
                const contentType = response.headers.get("Content-Type")
                if(contentType.includes("text/html")) {
                    return []
                } else if (contentType.includes("application/json")) {
                    return response.json()
                } else {
                    console.error("[ERROR] Unexpected Content-Type: ", contentType);
                    throw new Error("[ERROR] Unexpected Content-Type.");
                }
            })
            .catch(error => {
                console.log("fetch error", error)
                throw error
            })
    }

    static async postUsers(firstName, lastName, age) {
        try {
            const response = await fetch(
                "http://localhost:5000/api/users", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName: firstName,
                        lastName: lastName,
                        age: age
                    })
                })
            if (response.status !== 200) {
                console.error("[ERROR] Response status:", response.status);
                throw new Error("Failed to post users.");
            }

            const contentType = response.headers.get('Content-Type');

            console.log("177 - Content-Type = ", contentType)

            if (contentType.includes('application/json')) {

                return await response.json().then((entries) => entries[0]['id'])
            } else {
                console.error("[ERROR] Unexpected Content-Type: ", contentType);
                throw new Error("Unexpected Content-Type.");
            }

        } catch (error) {
            console.error("fetch error", error)
            throw error
        }
    }
}
//event to show App Name
document.addEventListener('DOMContentLoaded', UI.displayAppName)
//event to activate addButton
document.addEventListener('input', UI.activateAddButton)
//event to display users
document.addEventListener("DOMContentLoaded", UI.displayUsers)
// event to add user to DB, get user id, create user as Object
document.getElementById("form-user")
    .addEventListener('submit', async (event) =>{
        event.preventDefault()
        await UI.createUser()
        await UI.displayUsers()
    })