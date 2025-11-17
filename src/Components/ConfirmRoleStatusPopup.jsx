import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { useIntl } from 'react-intl'

export default function ConfirmRoleStatusPopup({ open, onClose, roleId, isActive, handleConfirm, loading }) {
    const { messages } = useIntl()
    
    return (
        <Dialog open={Boolean(open)} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle>
            {isActive ? messages.rolePage.inactiveRole : messages.rolePage.activeRole}
        </DialogTitle>
        <DialogContent>
            <Typography>
            {isActive ? messages.rolePage.deactivateRoleConfirmation : messages.rolePage.activateRoleConfirmation}
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button variant="contained" color="success" onClick={() => handleConfirm(roleId, !isActive)} disabled={loading}>
            {messages.yes}
            </Button>
            <Button variant="outlined" color="error" onClick={onClose} disabled={loading}>
            {messages.no}
            </Button>
        </DialogActions>
        </Dialog>
    )
}
