import { NextApiRequest, NextApiResponse } from "next"

export type RawApiHandler = (request: NextApiRequest, response: NextApiResponse) => Promise<void>

export type ApiHandlerMethod = "get" | "post" | "put" | "delete"
