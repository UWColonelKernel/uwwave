import { addSyncStorageListener } from '../common/storage'
import { updateBadge } from '../common/icon'

let heartbeatTimeout = setTimeout(updateBadge, 65000)

addSyncStorageListener(async () => {
    console.log('Sync storage was updated')
    await updateBadge()
    clearTimeout(heartbeatTimeout)
    heartbeatTimeout = setTimeout(updateBadge, 65000)
})

updateBadge().then()
