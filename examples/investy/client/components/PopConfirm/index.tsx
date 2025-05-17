import { FC, useState } from "react"
import _ from "lodash"
import { Search as SearchIcon } from "lucide-react"

import Modal from "@client/components/Modal"
import TextInput from "@client/components/TextInput"
import SelectInput from "@client/components/SelectInput"
import InputLabel from "@client/components/InputLabel"
import Divider from "@client/components/Divider"

import { api } from "@client/services/api"

import { NotionAssetSync } from "@client/protocols/asset-sync"
import { Database } from "@client/protocols/notion"

type Data = {
	databaseId: string
	assetCodePropertyId: string
	assetPricePropertyId: string
}

type PopConfirmProps = {
	description: string
	onConfirm?: () => Promise<void>
}

const PopConfirm: FC<PopConfirmProps> = (props) => {
	const {
		description,
		children,
		onConfirm
	} = props

	return (
		<Modal
			title="Are you sure?"
			onConfirm={onConfirm}
		>
			<Modal.Content>
				{description}
			</Modal.Content>

			<Modal.Trigger>
				{children}
			</Modal.Trigger>
		</Modal>
	)
}

export default PopConfirm
