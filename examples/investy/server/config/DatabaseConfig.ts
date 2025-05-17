const DatabaseConfig = {
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	name: process.env.DATABASE_NAME,
	port: Number(process.env.DATABASE_PORT),
}

export default DatabaseConfig
