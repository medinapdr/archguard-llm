import { FormEventHandler, useState } from "react"
import Image from "next/image"

import { routeConfig } from "@client/config/route"

import { api } from "@client/services/api"
import { loginAndRedirect } from "@client/services/auth"

import PageContainer from "@client/components/PageContainer"
import Button from "@client/components/Button"
import Divider from "@client/components/Divider"
import TextInput from "@client/components/TextInput"
import InputLabel from "@client/components/InputLabel"
import Head from "@client/components/Head"
import Link from "@client/components/Link"

import useValidation from "@client/hooks/useValidation"

import AppLogoSvg from "@client/assets/app/app_logo.svg"

type Data = {
	name: string
	email: string
	password: string
}

const Signup = () => {
	const [data, setData] = useState({} as Data)
	const [loading, setLoading] = useState(false)
	const validation = useValidation()

	const handleChange = <Field extends keyof Data>(field: Field, value: Data[Field]) => {
		setData(lastState => ({
			...lastState,
			[field]: value
		}))

		validation.clearFieldError(field)
	}

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault()

		setLoading(true)

		try {
			const response = await api.post<{ authToken: string }>("/users/signup", data)

			loginAndRedirect(response.data.authToken)
		} catch (error) {
			validation.digestRequestError(error)
		}

		setLoading(false)
	}

	return (
		<PageContainer>
			<Head
				page={{
					title: `Investy | ${routeConfig.signup.title}`
				}}
			/>

			<div className="container flex flex-col justify-center items-center h-full">
				<Image src={AppLogoSvg} alt="" className="w-40" />

				<Divider orientation="horizontal" size="md" />

				<h1 className="text-3xl text-gray-900 font-bold text-center">
					Create a new account
				</h1>

				<span className="text-gray-900 text-base text-center">
					Or <Link href={routeConfig.login.path}>sign in with an existing account</Link>
				</span>

				<Divider orientation="horizontal" size="md" />

				<form
					className="bg-white max-w-md w-full rounded-lg shadow-sm p-5"
					onSubmit={handleSubmit}
				>
					<div>
						<InputLabel
							inputName="name"
						>
							Name
						</InputLabel>
						<TextInput
							fullWidth
							name="name"
							value={data.name}
							onValueChange={value => handleChange("name", value)}
							errorMessage={validation.messages.name}
						/>
					</div>

					<Divider orientation="horizontal" size="sm" />

					<div>
						<InputLabel
							inputName="email"
						>
							Email
						</InputLabel>
						<TextInput
							fullWidth
							name="email"
							value={data.email}
							onValueChange={value => handleChange("email", value)}
							errorMessage={validation.messages.email}
						/>
					</div>

					<Divider orientation="horizontal" size="sm" />

					<div>
						<InputLabel
							inputName="password"
						>
							Password
						</InputLabel>
						<TextInput
							fullWidth
							name="password"
							value={data.password}
							onValueChange={value => handleChange("password", value)}
							type="password"
							errorMessage={validation.messages.password}
						/>
					</div>

					<Divider orientation="horizontal" size="md" />

					<Button
						fullWidth
						variant="primary"
						type="submit"
						loading={loading}
					>
						Sign up
					</Button>
				</form>
			</div>
		</PageContainer>
	)
}

export default Signup
