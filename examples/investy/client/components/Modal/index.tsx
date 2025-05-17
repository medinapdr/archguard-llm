import { FC, ReactElement, useState, FormEventHandler } from "react"
import { initModals } from "flowbite"
import { X as CloseIcon } from "lucide-react"

import useConstantId from "@client/hooks/useConstantId"
import useDidMount from "@client/hooks/useDidMount"
import useSubComponents, { attachSubComponents, buildSubComponents } from "@client/hooks/useSubComponents"

import ModalContent from "@client/components/Modal/ModalContent"
import ModalTrigger from "@client/components/Modal/ModalTrigger"

import Portal from "@client/components/Portal"
import Button from "@client/components/Button"
import IconButton from "@client/components/IconButton"

import { cloneElementSafely } from "@client/utils/node"
import { defaultTransitionClassName, mergeClassNames } from "@client/utils/style"

type ModalProps = {
	title: string
	onClose?: () => void
	onConfirm?: () => Promise<void> | void
}

const SubComponents = buildSubComponents({
	Trigger: ModalTrigger,
	Content: ModalContent
})

const Modal: FC<ModalProps> = (props) => {
	const {
		children,
		title,
		onConfirm,
		onClose
	} = props

	const id = useConstantId()
	const cancelButtonId = useConstantId()

	const [loadingConfirm, setLoadingConfirm] = useState(false)

	useDidMount(() => {
		initModals()
	})

	const handleConfirm = async () => {
		setLoadingConfirm(true)

		await onConfirm?.()

		setLoadingConfirm(false)

		const cancelButtonElement = document.getElementById(cancelButtonId)
		cancelButtonElement?.click()
	}

	const handleClose = () => {
		onClose?.()
	}

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault()

		await handleConfirm()
	}

	const subComponents = useSubComponents(children, SubComponents)

	return (
		<>
			{subComponents.Trigger[0] && (
				cloneElementSafely(subComponents.Trigger[0] as ReactElement, {
					["data-modal-target"]: id,
					["data-modal-show"]: id
				})
			)}

			<Portal
				container={document.body}
			>
				<div
					id={id}
					tabIndex={-1}
					aria-hidden="true"
					className={mergeClassNames([
						"fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full",
						defaultTransitionClassName
					])}
				>
					<form
						className="relative w-full h-full max-w-2xl md:h-auto"
						onSubmit={handleSubmit}
					>
						<div
							className="relative bg-white rounded-lg shadow"
						>
							<div
								className="flex items-start justify-between pl-6 pr-4 py-4 border-b rounded-t relative text-gray-700"
							>
								<h3
									className="text-xl font-semibold"
								>
									{title}
								</h3>

								<IconButton
									data-modal-hide={id}
									onClick={handleClose}
									className="absolute top-2 right-2"
								>
									<CloseIcon />
								</IconButton>
							</div>

							<div
								className="p-6"
							>
								{subComponents.Content}
							</div>

							<div
								className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b"
							>
								<Button
									loading={loadingConfirm}
									variant="primary"
									onClick={handleConfirm}
									type="submit"
								>
									Confirm
								</Button>

								<Button
									id={cancelButtonId}
									data-modal-hide={id}
									variant="secondary"
									onClick={handleClose}
									type="button"
								>
									Cancel
								</Button>
							</div>
						</div>
					</form>
				</div>
			</Portal>
		</>
	)	
}

export default attachSubComponents(Modal, SubComponents)
