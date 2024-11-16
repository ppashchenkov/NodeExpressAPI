const appName = document.getElementById('appName')
const firstNameInput = document.getElementById('firstname')
const lastNameInput = document.getElementById('lastname')
const ageInput = document.getElementById('age')
const addButton = document.getElementById('addButton')
const searchButton = document.getElementById('searchButton')
const usersList = document.getElementById('usersList')
const formAdd = document.getElementById('form-user')
const formSearch = document.getElementById('form-search')
const userIdInput = document.getElementById('userId')
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
let rowNumber = 0
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
        rowNumber = 1
        const users = await UserService.getUsers() //API call GET users
        if (usersCurrent.length > 0) {
            const trs = document.getElementsByTagName("tr")
            for (let i = usersCurrent.length; i > 0 ; i--) {
                trs[i].remove()
                console.log("CLEARINGGGGGGGGG_____________________________")
            }
        }
        if (users.length) {
            users.forEach((user) => {
                UI.addUserToList(user)
            })
        }
        console.log("84 USERS_LENGTH = ", users.length)
        if (users.length) {
            usersCurrent = users
        } else {
            usersCurrent = []
        }
    }

    static async createUser() {
        if (UI.isFormValid()) {
            const firstName = firstNameInput.value.trim()
            const lastName = lastNameInput.value.trim()
            const age = ageInput.value
            id = await UserService.postUsers(firstName, lastName, age)
            let newUser = {}

            newUser = new User(firstName, lastName, age, id)
            console.log("Object of class User (OOP): ", newUser);

            return newUser
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

    static getSearchCriteria() {
        const userIDValue = userIdInput.value.trim().length > 0 ? userIdInput.value.trim() : ''
        const firstNameValue = firstNameInput.value.trim().length > 0 ? userIdInput.value.trim() : ''
        const lastNameValue = lastNameInput.value.trim().length > 0 ? userIdInput.value.trim() : ''
        const ageValue = ageInput.value.trim().length > 0 ? userIdInput.value.trim() : ''

        if (userIDValue.length || firstNameValue.length || lastNameValue.length || ageValue.length !== -1) {
            return {
                'userId': userIDValue,
                'firstName': firstNameValue,
                'lastName': lastNameValue,
                'age': ageValue
            }
        }
        return {}
    }

    static isSearchCriteriaValid(searchCriteria) {
        return Object.keys(searchCriteria).length > 0
    }

    static activateSearchButton() {
        const searchCriteria = UI.getSearchCriteria()
        console.log("searchCriteria", searchCriteria)

        // const isSearchCriteriaValid = UI.isSearchCriteriaValid(searchCriteria)
        if (UI.isSearchCriteriaValid(searchCriteria)) {
            searchButton.disabled = false
        }
    }

    static preventSearchUrl() {
        if (window.location.pathname === '/search?') {
            window.history.pushState({}, '', '/search')
        }
    }

    static async searchUsers() {
        const searchCriteria = UI.getSearchCriteria()
        if((UI.isSearchCriteriaValid(searchCriteria))) {
            const users = await UserService.getUsers() || {}
            console.log("Users = ", users)


            usersList.innerHTML = ''
            let searchResultRowNumber = 1

            users.forEach((user) => {
                if (user.id === searchCriteria.userId
                    || user.firstName === searchCriteria.firstName
                    || user.lastName === searchCriteria.lastName
                    || user.age === searchCriteria.age
                ) {
                    const foundUser = new User(user.firstName, user.lastName, user.age, user.id)
                    console.log("FoundUser = ", foundUser)

                    const row = document.createElement('tr')

                    row.innerHTML = `
                    <th scope="row">${searchResultRowNumber}</th>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.id}</td>
                `

                    usersList.appendChild(row)
                    searchResultRowNumber++
                }
            })
        }
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
        if (!firstName || !lastName || age === undefined) {
            console.error("[ERROR] Invalid parameters.")
            throw new Error("Invalid parameters.");
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/users",
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                        firstName: firstName,
                        lastName: lastName,
                        age: age
                        }
                    )
                })

            if (response.status !== 200) {
                console.error("[ERROR] Response status:", response.status);
                throw new Error("Failed to post users.");
            }

            const contentType = response.headers.get('Content-Type');

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

//event to display users
document.addEventListener("DOMContentLoaded", UI.displayUsers)


if (formAdd !== null) {
    //event to activate addButton
    formAdd.addEventListener('input', UI.activateAddButton)

    // event to add user to DB, get user id, create user as Object
// find specific user, create user as an object,
// and display specific user in a table

    formAdd.addEventListener('submit', async (event) => {
        event.preventDefault();

        const user = await UI.createUser();
        UI.addUserToList(user);

        form.reset();
        addButton.disabled = true;
    })
}

if (formSearch !== null) {
    formSearch.addEventListener('input', UI.activateSearchButton)

    formSearch.addEventListener('submit', async (event) => {
        event.preventDefault()
        UI.preventSearchUrl()

        await UI.searchUsers()

        formSearch.reset
        searchButton.disabled = true
    })
}
