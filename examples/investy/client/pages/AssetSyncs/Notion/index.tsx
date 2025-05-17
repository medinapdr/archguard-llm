import { ReactElement, useState } from "react"
import { MoreVertical as OptionsIcon } from "lucide-react"

import ApplicationLayout from "@client/components/ApplicationLayout"

import Head from "@client/components/Head"
import Table from "@client/components/Table"
import Chip from "@client/components/Chip"
import IconButton from "@client/components/IconButton"
import Dropdown from "@client/components/Dropdown"
import Loading from "@client/components/Loading"
import Link from "@client/components/Link"
import PopConfirm from "@client/components/PopConfirm"

import EditAssetSyncModal from "@client/pages/AssetSyncs/Notion/components/EditAssetSyncModal"

import { api } from "@client/services/api"

import { routeConfig } from "@client/config/route"

import useDidMount from "@client/hooks/useDidMount"

import { formatHumanDate } from "@client/utils/date"

import { NotionAssetSync } from "@client/protocols/asset-sync"

const NotionAssetSyncs = () => {
	const [notionAssetSyncs, setNotionAssetSyncs] = useState<NotionAssetSync[]>([])
	const [loading, setLoading] = useState(true)

	const loadData = async () => {
		const response = await api.get<NotionAssetSync[]>("/asset-syncs/notion")

		setNotionAssetSyncs(response.data)

		setLoading(false)
	}

	const renderLastSyncInfo = (notionAssetSync: NotionAssetSync) => {
		const statusChipMap: Record<NotionAssetSync["lastSyncStatus"] | "default", ReactElement> = {
			success: (
				<Chip
					variant="success"
				>
					Success
				</Chip>
			),
			processing: (
				<Chip
					variant="warning"
				>
					Processing
				</Chip>
			),
			error: (
				<Chip
					variant="error"
				>
					Error
				</Chip>
			),
			default: (
				<Chip
					className="bg-[#F3F4F6] text-[#1F2937]"
				>
					Unknown
				</Chip>
			)
		}

		return (
			<>
				{statusChipMap[notionAssetSync.lastSyncStatus] || statusChipMap.default}

				<Chip
					className="bg-[#F3F4F6] text-[#646464] font-normal"
				>
					{formatHumanDate(notionAssetSync.lastSyncAt)}
				</Chip>
			</>
		)
	}

	const handleSync = async (notionAssetSync: NotionAssetSync) => {
		await api.post(`/asset-syncs/${notionAssetSync.id}/notion`)
	}

	useDidMount(() => {
		loadData()
	})

	return (
		<ApplicationLayout>
			<Head
				page={{
					title: `Investy | ${routeConfig.notionAssetSyncs.title}`,
				}}
			/>

			<Loading
				loading={loading}
			>
				<Table>
					<Table.Head>
						<Table.Column>
							Database
						</Table.Column>

						<Table.Column>
							Asset Code
						</Table.Column>

						<Table.Column>
							Asset Price
						</Table.Column>

						<Table.Column>
							Last Sync
						</Table.Column>

						<Table.Column />
					</Table.Head>

					<Table.Body>
						{notionAssetSyncs.map(notionAssetSync => (
							<Table.Row
								key={notionAssetSync.id}
							>
								<Table.Column>
									<Link
										href={notionAssetSync.notion?.database?.url}
										target="_blank"
										rel="noreferrer"
									>
										{notionAssetSync.notion?.database?.name}
									</Link>
								</Table.Column>
								
								<Table.Column>
									{notionAssetSync.notion?.assetCode?.name}
								</Table.Column>

								<Table.Column>
									{notionAssetSync.notion?.assetPrice?.name}
								</Table.Column>

								<Table.Column>
									{renderLastSyncInfo(notionAssetSync)}
								</Table.Column>

								<Table.Column
									className="text-right"
								>
									<Dropdown>
										<EditAssetSyncModal
											title="Edit"
											notionData={notionAssetSync?.notion}
											data={{
												databaseId: notionAssetSync?.notion?.database?.id,
												assetCodePropertyId: notionAssetSync?.notion?.assetCode?.id,
												assetPricePropertyId: notionAssetSync?.notion?.assetPrice?.id
											}}
										>
											<Dropdown.Item>
													Edit
											</Dropdown.Item>
										</EditAssetSyncModal>

										<PopConfirm
											description="This action cannot be undone."
										>
											<Dropdown.Item>
												Delete
											</Dropdown.Item>
										</PopConfirm>

										<PopConfirm
											description="After asset synchronization starts, you cannot stop it."
											onConfirm={async () => await handleSync(notionAssetSync)}
										>
											<Dropdown.Item>
												Sync
											</Dropdown.Item>
										</PopConfirm>
										
										<Dropdown.Trigger>
											<IconButton>
												<OptionsIcon />
											</IconButton>
										</Dropdown.Trigger>
									</Dropdown>
								</Table.Column>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			</Loading>
		</ApplicationLayout>
	)
}

export default NotionAssetSyncs
