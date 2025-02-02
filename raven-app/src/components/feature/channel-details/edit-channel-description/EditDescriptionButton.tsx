import { Button, ButtonProps } from '@chakra-ui/react'
import { ModalTypes, useModalManager } from "@/hooks/useModalManager"
import { EditChannelDescriptionModal } from './EditChannelDescriptionModal'
import { ChannelListItem } from '@/utils/channel/ChannelListProvider'

interface EditDescriptionButtonProps extends ButtonProps {
    channelData: ChannelListItem,
    is_in_box?: boolean
}

export const EditDescriptionButton = ({ channelData, is_in_box, ...props }: EditDescriptionButtonProps) => {

    const modalManager = useModalManager()
    const onChannelDescriptionModalOpen = () => {
        modalManager.openModal(ModalTypes.EditChannelDescription)
    }

    const button_text = channelData && channelData.channel_description && channelData.channel_description.length > 0 ? 'Edit' : 'Add'

    return (
        <>
            <Button colorScheme='blue' variant='link' size='sm' onClick={onChannelDescriptionModalOpen} {...props}>
                {button_text} {is_in_box ? '' : 'description'}
            </Button>
            <EditChannelDescriptionModal
                isOpen={modalManager.modalType === ModalTypes.EditChannelDescription}
                onClose={modalManager.closeModal}
                channelData={channelData} />
        </>
    )
}