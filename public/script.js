const appName = document.getElementById('appName')
const firstNameInput = document.getElementById('firstname')
const lastNameInput = document.getElementById('lastname')
const ageInput = document.getElementById('age')
const userIdInput = document.getElementById('userId')
const addButton = document.getElementById('addButton')
const searchButton = document.getElementById('searchButton')
const editButton = document.getElementById('editButton')
const deleteButton = document.getElementById('deleteButton')
const usersList = document.getElementById('usersList')
const formAdd = document.getElementById('form-user')
const formSearch = document.getElementById('form-search')
const formEdit = document.getElementById('form-edit')
const formDelete = document.getElementById('form-delete')

let rowNumber = 1
let usersCurrent = []
let id
const defaultIdPlaceholder = "EnterUserId..."
const defaultFirstNamePlaceholder = "Enter first name"
const defaultLastNamePlaceholder = "Enter last name"
const defaultAgePlaceholder = "Enter age ( 1 - 150 )"

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

    static async  displayUsers() {
        // const users = storedUsers //Mock data;
        const users = await UserService.getUsers() || []; //API call GET users;

        if(typeof users !== 'string' && users.length) {
            users.forEach((user) => {
                // console.log('user = ', user);
                UI.addUserToList(user, rowNumber);
                rowNumber ++;
            })
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

    static addUserToList(user, number) {
        const row = document.createElement('tr')

        row.innerHTML = `
            <th scope="row">${number}</th>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.id}</td>
            <td>
                <i class="icon" id="editIcon">
                    <a href="/edit" class="bi-pen">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                        </svg>
                    </a>
                </i>
            </td>
            <td>
                <i class="icon" id="deleteIcon">
                    <a href="/delete" class="bi-trash">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                        </svg>
                    </a>
                </i>
            </td>
        `;

        usersList.appendChild(row)
    }

    static getSearchCriteria() {
        const userIDValue = userIdInput.value.trim().length > 0 ? userIdInput.value.trim() : ''
        const firstNameValue = firstNameInput.value.trim().length > 0 ? firstNameInput.value.trim() : ''
        const lastNameValue = lastNameInput.value.trim().length > 0 ? lastNameInput.value.trim() : ''
        const ageValue = ageInput.value.trim().length > 0 ? ageInput.value.trim() : -1

        // console.log("110 firstNameValue = ", firstNameValue)

        if (userIDValue.length > 0 || firstNameValue.length > 0 || lastNameValue.length > 0 || ageValue.length !== -1) {
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
        // console.log("searchCriteria", searchCriteria)

        // const isSearchCriteriaValid = UI.isSearchCriteriaValid(searchCriteria)
        if (UI.isSearchCriteriaValid(searchCriteria)) {
            searchButton.disabled = false
        }
    }

    static getDeleteCriteria() {
        const userIDValue = userIdInput.value.trim().length > 0 ? userIdInput.value.trim() : ''

        if (userIDValue.length > 0) {
            return {
                'userId': userIDValue,
            }
        }
        return {}
    }

    static isDeleteCriteriaValid(DeleteCriteria) {
        return Object.keys(DeleteCriteria).length > 0
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
            // console.log("145 Users = ", users)

            usersList.innerHTML = ''
            let searchResultRowNumber = 1

            users.forEach((user) => {
                if (user.id === searchCriteria.userId
                    || user.firstName === searchCriteria.firstName
                    || user.lastName === searchCriteria.lastName
                    || user.age === searchCriteria.age
                ) {
                    const foundUser = new User(user.firstName, user.lastName, user.age, user.id)
                    // console.log("FoundUser = ", foundUser)

                    UI.addUserToList(foundUser, searchResultRowNumber)
                    searchResultRowNumber++
                }
            })
        }
    }

    static getRowText(event) {
        const userRow = event.target.closest('tr')
        let userInfo = []
        if (userRow) {
            const userCells = userRow.cells
            for (let i = 1; i < 5; i++) {
                userInfo[i-1] = userCells[i].textContent.trim()
            }
        }
        return userInfo
    }

    static setValuesToLocalStorage(user) {
        if(user != null) {
            localStorage.setItem("idValue", user.id)
            localStorage.setItem("firstNameValue", user.firstName)
            localStorage.setItem("lastNameValue", user.lastName)
            localStorage.setItem("ageValue", user.age)

        }
    }

    static clearLocalStorage() {
        if(localStorage.getItem('idValue') !== null) {
            localStorage.removeItem('idValue')
        }
        if(localStorage.getItem('firstNameValue') !== null) {
            localStorage.removeItem('firstNameValue')
        }
        if(localStorage.getItem('lastNameValue') !== null) {
            localStorage.removeItem('lastNameValue')
        }
        if(localStorage.getItem('ageValue') !== null) {
            localStorage.removeItem('ageValue')
        }
    }

    static activateEditButton(str) {
        if(str) {
            editButton.disabled = false
        }
    }

    static fillPlaceholders() {
        const id = localStorage.getItem('idValue')
        const firstName = localStorage.getItem('firstNameValue')
        const lastName = localStorage.getItem('lastNameValue')
        const age = localStorage.getItem('ageValue')

        userIdInput.placeholder = id ? id : defaultIdPlaceholder
        firstNameInput.placeholder = firstName ? firstName : defaultFirstNamePlaceholder
        lastNameInput.placeholder = lastName ? lastName : defaultLastNamePlaceholder
        ageInput.placeholder = age ? age : defaultAgePlaceholder
    }

    static activateDeleteButton() {
        if(userIdInput.placeholder !== defaultIdPlaceholder
            && firstNameInput.placeholder !== defaultFirstNamePlaceholder
            && lastNameInput.placeholder !== defaultLastNamePlaceholder
            && ageInput.placeholder !== defaultAgePlaceholder
        ) {
            userIdInput.readOnly = true;
            firstNameInput.readOnly = true;
            lastNameInput.readOnly = true;
            ageInput.readOnly = true;

            userIdInput.disabled = true;
            firstNameInput.disabled = true;
            lastNameInput.disabled = true;
            ageInput.disabled = true;

            deleteButton.disabled = false;
        }
    }

    static getUpdatedUser() {
        let updatedUser = {}
        updatedUser.id = localStorage.getItem('idValue')
        if(firstNameInput.value.trim()) {
            updatedUser.firstName = firstNameInput.value.trim();
        }
        if(lastNameInput.value.trim()) {
            updatedUser.lastName = lastNameInput.value.trim();
        }
        if(ageInput.value.trim()) {
            updatedUser.age = ageInput.value.trim();
        }

        return updatedUser
    }

    static async editUser() {
        const updatedUser = UI.getUpdatedUser()
        await UserService.patchUsers(updatedUser)
    }

    static async deleteUser() {
        const id = localStorage.getItem('idValue')
        await UserService.deleteUsers(id)
    }
}

class AppService {
    static async getAppName() {
        return await fetch("http://localhost:5000/api/")
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

    static async deleteUser(userId) {
        if (!userId === undefined) {
            console.error("[ERROR] Invalid parameters.")
            throw new Error("Invalid parameters.");
        }
        try {
            const response = await fetch(
                `http://localhost:5000/api/users/${userId}`,
                {
                    method: 'DELETE',
                    },
                )
            if (response.status !== 200) {
                console.error("[ERROR] Response status:", response.status);
                throw new Error("Failed to delete users.");
            }
        } catch (error) {
            console.error("fetch error", error)
            throw error
        }
    }

    static async patchUsers(user) {
        if (!user.id || (!user.firstName && !user.lastName && user.age === undefined)) {
            console.error("[ERROR] Invalid parameters.")
            throw new Error("Invalid parameters.");
        }
        let body = {}
        if(user.firstName) {
            body.firstName = user.firstName;
        }
        if(user.lastName) {
            body.lastName = user.lastName;
        }
        if(user.age) {
            body.age = user.age;
        }
        console.log("BODY = ", body)
        try {
            const response = await fetch(
                `http://localhost:5000/api/users/${user.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body)
                })
            if (response.status !== 200) {
                console.error("[ERROR] Response status:", response.status);
                throw new Error("Failed to post users.");
            }
            const contentType = response.headers.get('Content-Type');
            if (contentType.includes('text/html')) {
                return await response.text();
            } else {
                console.error("[ERROR] Unexpected Content-Type: ", contentType);
                throw new Error("Unexpected Content-Type.");
            }
        } catch (error) {
            console.error("fetch error", error)
            throw error
        }
    }

    static async deleteUsers(id) {
        if (!id) {
            console.error("[ERROR] Invalid parameters.")
            throw new Error("Invalid parameters.");
        }
        try {
            const response = await fetch(
                `http://localhost:5000/api/users/${id}`,
                {
                    method: 'DELETE',
                })
            if (response.status !== 200) {
                console.error("[ERROR] Response status:", response.status);
                throw new Error("Failed to post users.");
            }
            const contentType = response.headers.get('Content-Type');
            if (contentType.includes('text/html')) {
                return await response.text();
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
    UI.clearLocalStorage()
    formAdd.addEventListener('input', UI.activateAddButton)

    formAdd.addEventListener('submit', async (event) => {
        event.preventDefault();

        const user = await UI.createUser();
        UI.addUserToList(user, rowNumber);
        rowNumber++

        formAdd.reset();
        addButton.disabled = true;
    })
}

if (formSearch !== null) {
    UI.clearLocalStorage()
    formSearch.addEventListener('input', UI.activateSearchButton)

    formSearch.addEventListener('submit', async (event) => {
        event.preventDefault()
        UI.preventSearchUrl()

        await UI.searchUsers()

        formSearch.reset()
        searchButton.disabled = true
    })
}

//any tab
usersList.addEventListener('click', (event) => {
    console.log(event.target)
    if (event.target.classList.contains('bi-pen') || event.target.classList.contains('bi-trash')) {
        const userInfo = UI.getRowText(event)
        const copiedUser = new User(userInfo[0], userInfo[1], userInfo[2], userInfo[3])

        // console.log("copiedUser = ", copiedUser)

        UI.clearLocalStorage()
        UI.setValuesToLocalStorage(copiedUser)
    }
})

if(formEdit !== null) {
    document.addEventListener('DOMContentLoaded', () => {
        UI.fillPlaceholders()
        if(userIdInput.placeholder !== defaultIdPlaceholder) {
            userIdInput.readOnly = true
            userIdInput.disabled = true

            firstNameInput.addEventListener('input', () => {
                firstNameInput.style.backgroundColor = '#E8F0FE'
                UI.activateEditButton(firstNameInput.value.trim())
            })
            lastNameInput.addEventListener('input', () => {
                lastNameInput.style.backgroundColor = '#E8F0FE'
                UI.activateEditButton(lastNameInput.value.trim())
            })
            ageInput.addEventListener('input', () => {
                ageInput.style.backgroundColor = '#E8F0FE'
                UI.activateEditButton(ageInput.value.trim())
            })
        }
    })

    editButton.addEventListener('click', async  () => {
        await UI.editUser()
        UI.clearLocalStorage()
    })
}

if(formDelete !== null) {
    document.addEventListener('DOMContentLoaded', () => {
        UI.fillPlaceholders();
        UI.activateDeleteButton();
    })

    deleteButton.addEventListener('click', async  () => {
        await UI.deleteUser()
        UI.clearLocalStorage()
    })
}