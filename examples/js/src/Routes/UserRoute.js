const { Router } = require("express")

const UserController = require("../Controllers/UserController")

const route = new Router()

route.get(
	"/users",
	UserController.getAllUsers
)

route.post(
	"/users",
	UserController.createUser
)

module.exports = route