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

type EditAssetSyncModalProps = {
	data?: Data
	notionData?: NotionAssetSync["notion"]
	title: string
	onSave?: (data: Data) => Promise<void>
}

const EditAssetSyncModal: FC<EditAssetSyncModalProps> = (props) => {
	const {
		notionData,
		data,
		children,
		onSave
	} = props

	const mockedCurrentDatabase = {
		title: notionData?.database?.name,
		id: notionData?.database?.id,
		cover: undefined,
		icon: undefined,
		url: undefined,
		columns: [
			{
				id: notionData?.assetCode?.id,
				name: notionData?.assetCode?.name,
				type: undefined
			},
			{
				id: notionData?.assetPrice?.id,
				name: notionData?.assetPrice?.name,
				type: undefined
			}
		]
	}

	const [updatedData, setUpdatedData] = useState<Data>(data)
	const [foundDatabases, setFoundDatabases] = useState<Database[]>([mockedCurrentDatabase])

	const handleChange = <Field extends keyof Data>(field: Field, value: Data[Field]) => {
		setUpdatedData(lastState => ({
			...lastState,
			[field]: value,
			...(field === "databaseId" && ({
				assetCodePropertyId: "",
				assetPricePropertyId: ""
			}))
		}))
	}

	const handleSave = async () => {
		await onSave?.(updatedData)
	}

	const handleSearchNotionDatabases = async (name: string) => {
		if (name) {
			const response = await api.get<Database[]>("/integrations/notion/database", {
				params: {
					name
				}
			})
	
			setFoundDatabases([mockedCurrentDatabase, ...response.data])
		}
	}

	const currentDatabase = foundDatabases.find(({ id }) => id === updatedData?.databaseId)

	return (
		<Modal
			title="Edit Notion Asset Sync"
			onConfirm={handleSave}
		>
			<Modal.Content>
				<div>
					<InputLabel
						inputName="databaseId"
					>
						Database
					</InputLabel>

					<TextInput
						placeholder="Search a database..."
						fullWidth
						name="search"
						onValueChange={value => handleSearchNotionDatabases(value)}
						startAdornment={<SearchIcon className="text-gray-700" />}
					/>

					<Divider orientation="horizontal" size="xs" />

					<SelectInput
						fullWidth
						name="databaseId"
						value={updatedData.databaseId}
						onValueChange={value => handleChange("databaseId", value)}
						placeholder="Select a database..."
					>
						{foundDatabases.map(database => (
							<SelectInput.Option
								key={database?.id}
								value={database?.id}
							>
								{database?.title}
							</SelectInput.Option>
						))}
					</SelectInput>
				</div>

				<Divider orientation="horizontal" size="sm" />

				<div>
					<InputLabel
						inputName="assetCodePropertyId"
					>
						Asset Code
					</InputLabel>
					<SelectInput
						fullWidth
						name="assetCodePropertyId"
						value={updatedData.assetCodePropertyId}
						onValueChange={value => handleChange("assetCodePropertyId", value)}
						placeholder="Select a database property..."
					>
						{currentDatabase?.columns?.map(column => (
							<SelectInput.Option
								key={column?.id}
								value={column?.id}
							>
								{column?.name}
							</SelectInput.Option>
						))}
					</SelectInput>
				</div>

				<Divider orientation="horizontal" size="sm" />

				<div>
					<InputLabel
						inputName="assetPricePropertyId"
					>
						Asset Price
					</InputLabel>
					<SelectInput
						fullWidth
						name="assetPricePropertyId"
						value={updatedData.assetPricePropertyId}
						onValueChange={value => handleChange("assetPricePropertyId", value)}
						placeholder="Select a database property..."
					>
						{currentDatabase?.columns?.map(column => (
							<SelectInput.Option
								key={column?.id}
								value={column?.id}
							>
								{column?.name}
							</SelectInput.Option>
						))}
					</SelectInput>
				</div>

				<Divider orientation="horizontal" size="xs" />
			</Modal.Content>

			<Modal.Trigger>
				{children}
			</Modal.Trigger>
		</Modal>
	)
}

export default EditAssetSyncModal
