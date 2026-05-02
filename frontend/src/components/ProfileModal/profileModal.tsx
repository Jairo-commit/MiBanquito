import { Box, IconButton, Modal, Paper, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import * as styles from "./profileModal.sx";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileModal({ open, onClose }: ProfileModalProps) {
  const { data: user } = useCurrentUser();

  return (
    <Modal open={open} onClose={onClose}>
      <Paper sx={styles.modalPaperSx} data-testid="profile-modal">
        <Box sx={styles.headerSx}>
          <Typography variant="h6" sx={styles.titleSx}>
            Profile
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            data-testid="profile-modal-close"
            aria-label="close profile"
          >
            <Close />
          </IconButton>
        </Box>

        {user && (
          <>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Full Name
              </Typography>
              <Typography variant="body1" data-testid="profile-modal-fullname">
                {user.full_name ?? user.username}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1" data-testid="profile-modal-email">
                {user.email}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Document
              </Typography>
              <Typography variant="body1" data-testid="profile-modal-document">
                {user.document_type} {user.document_number}
              </Typography>
            </Box>
            {user.city && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  City
                </Typography>
                <Typography variant="body1" data-testid="profile-modal-city">
                  {user.city}
                </Typography>
              </Box>
            )}
            {user.phone && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1" data-testid="profile-modal-phone">
                  {user.phone}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Paper>
    </Modal>
  );
}
