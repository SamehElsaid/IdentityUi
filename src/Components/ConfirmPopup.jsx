import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { LoadingButton } from '@mui/lab'

/**
 * Reusable confirm dialog. Pass open/onClose, message (and optional title),
 * and onConfirm (sync or async). Confirm shows a loading state until the promise settles.
 */
function ConfirmPopup({
  open,
  onClose,
  title,
  message,
  children,
  confirmText,
  cancelText,
  onConfirm,
  confirmColor = 'primary',
  cancelVariant = 'text',
  confirmVariant = 'contained',
  maxWidth = 'xs',
  fullWidth = true,
  disableBackdropClick = false
}) {
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) {
      setSubmitting(false)
    }
  }, [open])

  const handleClose = (event, reason) => {
    if (submitting) {
      return
    }
    if (reason === 'backdropClick' && disableBackdropClick) {
      return
    }
    onClose?.()
  }

  const handleCancel = () => {
    if (submitting) {
      return
    }
    onClose?.()
  }

  const handleConfirm = async () => {
    if (!onConfirm) {
      onClose?.()

      return
    }
    try {
      setSubmitting(true)
      await Promise.resolve(onConfirm())
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      aria-labelledby={title ? 'confirm-dialog-title' : undefined}
      aria-describedby={message ? 'confirm-dialog-description' : undefined}
    >
      {title ? <DialogTitle id='confirm-dialog-title'>{title}</DialogTitle> : null}
      <DialogContent>
        {message ? (
          <DialogContentText id='confirm-dialog-description' component='div'>
            {message}
          </DialogContentText>
        ) : null}
        {children}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant={cancelVariant} onClick={handleCancel} disabled={submitting} color='secondary'>
          {cancelText}
        </Button>
        <LoadingButton
          loading={submitting}
          variant={confirmVariant}
          onClick={handleConfirm}
          color={confirmColor}
        >
          {confirmText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmPopup
