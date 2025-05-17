import { AppProps } from "next/app"
import { NextPage } from "next"
import Head from "next/head"

const App: NextPage<AppProps> = (props) => {
	const { Component, pageProps } = props

	return (
		<>
			<Head>
				<link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.3/flowbite.min.css" rel="stylesheet" />
			</Head>
	
			<Component {...pageProps} />
	
			<script async src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.3/flowbite.min.js"></script>
		</>
	)
}

export default App
