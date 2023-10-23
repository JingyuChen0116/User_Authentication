import './style.scss'
import axios from 'axios'
import * as animation from './src/animation'
import * as utils from './src/utils'

const loginBtn = document.querySelector('.login-btn')
const registerBtn = document.querySelector('.register-btn')
const username = document.querySelector('#username')
const password = document.querySelector('#password')
const new_username = document.querySelector('#new-username')
const password_one = document.querySelector('#reg-password-one')
const password_two = document.querySelector('#reg-password-two')
const signOutBtn = document.querySelector('#sign-out')

loginBtn.addEventListener('click', login)
registerBtn.addEventListener('click', register)
signOutBtn.addEventListener('click', signOut)

const backendPath = 'http://localhost:9098/api/'

async function login(event) {
  event.preventDefault()
  if (utils.checkInputEmpty([username, password])) {
    animation.showError()
    return
  }

  try {
    const response = await axios.post(backendPath + 'login', {
      username: username.value,
      password: password.value
    }).then( res => res.data )
    console.log(response)

    if (response.code === 0) {
      document.querySelector('#welcome-user-name').textContent = username.value
      utils.clearDomValue([username, password])
      animation.showCorrect()
      animation.LoginToWelcome()
      response.token && localStorage.setItem('token', response.token)
    }
  } catch (err) {
    console.log(err?.response?.data)
    animation.showError()

    const code = err?.response?.data?.code
    switch(code) {
      case 1:
        animation.showError()
        break
      case 2:
        animation.showUnknown()
        break
      default:
        animation.showUnknown()
        break
    }
  }
}

async function signOut(event) {
  event.preventDefault()
  utils.clearDomValue([username, password])
  animation.WelcomeToLogin()
  localStorage.removeItem('token')
}

async function register(event) {
  event.preventDefault()
  if (utils.checkInputEmpty([new_username, password_one, password_two])) {
    console.log("Empty field")
    animation.showError()
  } else if (password_one.value !== password_two.value){
    console.log("password not match")
    animation.showError() 
  } else {
    let errResponse = null
    const response = await axios.post(backendPath + "register", {
      username: new_username.value,
      password: password_one.value
    }).then(res => res.data).catch(err => {
      console.log("Error here", err)
      errResponse = err?.response?.data
    })

    switch (Number(response?.code || errResponse?.code)) {
      case 0:
        animation.showCorrect()
        utils.clearDomValue([new_username, password_one, password_two])
        animation.RegisterToLogin()
        break;
      case 1:
        animation.showUnknown()
        break;
      case 2:
        animation.showError()
        break;
      default:
        animation.showUnknown()
        break;
    }
  }

}


// ===== To Register and Login Btn Function=====
const toRegisterBtn = document.querySelector('.to-register-btn')
const toLoginBtn = document.querySelector('.to-login-btn')

toRegisterBtn.addEventListener('click', showRegister)
toLoginBtn.addEventListener('click', showLogin)

function showRegister(event) {
  event.preventDefault()
  utils.clearDomValue([new_username, password_one, password_two])
  animation.LoginToRegister()
}

function showLogin(event) {
  event.preventDefault()
  utils.clearDomValue([username, password])
  animation.RegisterToLogin()
}

async function checkToken() {
  const token = localStorage.getItem('token')
  if (token) {
    // request header - mandatory
    const configuration = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    try {
      const response = await axios.post(backendPath + 'loginToken', { test: "hello" }, configuration).then(res => res.data)
      if (response.code === 0) {
        document.querySelector('#welcome-user-name').textContent = response.username
        animation.LoginToWelcome()
        response.token && localStorage.setItem('token', response.token)
      }
    } catch (err) {
      console.log(err)
    }
  }
}

checkToken()