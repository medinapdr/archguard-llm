import { DocumentModel } from "@/Models/DocumentModel"
import { SenderContract } from "@/Protocols/SenderProtocol"
import { KindleConfig } from "@/Protocols/SetupInputProtocol"

import SMTPSenderTool from "@/Tools/Senders/SMTPSenderTool"

class GmailSenderTool implements SenderContract {
	private readonly smtpSenderTool: SMTPSenderTool

	constructor (email: string, password: string) {
		this.smtpSenderTool = new SMTPSenderTool({
			host: "gmail-smtp-msa.l.google.com",
			email,
			password,
			user: email,
			port: 465
		}, {
			secure: true,
			tls: {
				ciphers: "SSLv3",
				rejectUnauthorized: false
			}
		})
	}

	async sendToKindle (document: DocumentModel, kindleConfig: KindleConfig): Promise<void> {
		return await this.smtpSenderTool.sendToKindle(document, kindleConfig)
	}
}

export default GmailSenderTool
