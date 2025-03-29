import React from 'react';
import { Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const UserManagement: React.FC = () => {
  return (
    <Accordion sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b75bc' }}>
          User Management
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography align="center" color="text.secondary">
          User management features coming soon.
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default UserManagement;