const UserService = require("../Services/UserService")
const UserValidation = require("../Validations/UserValidation")

class UserController {
	getAllUsers (req, res) {
		try {
			const users = UserService.getAll()

			return res.status(200).json({ users })
		} catch (error) {
			console.error(error)
			return res.status(500).json({ error: "Server Error" })
		}
	}

	createUser (req, res) {
		try {
			const user = req.body.user

			const validation = UserValidation.validateCreateUserParams(user)

			if (!validation.isValid) {
				return res.status(400, { messages: validation.messages })
			}

			UserService.create(user)

			return res.status(201).json({})
		} catch (error) {
			console.error(error)
			return res.status(500).json({ error: "Server Error" })
		}
	}

	updateUser (req, res) {
		try {
			const userId = req.params.userId
			const updatedUserData = req.body

			const userExists = UserService.getById(userId)

			if (!userExists) {
				return res.status(404, { error: "Not Found" })
			}

			UserService.updateById(userId, updatedUserData)

			return res.status(201).json({})
		} catch (error) {
			console.error(error)
			return res.status(500).json({ error: "Server Error" })
		}
	}
}

module.exports = new UserController()
