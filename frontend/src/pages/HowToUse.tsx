import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AccountIcon from '@mui/icons-material/AccountCircle';
import CalcIcon from '@mui/icons-material/Calculate';
import TileIcon from '@mui/icons-material/ViewModule';
import DimensionsIcon from '@mui/icons-material/Straighten';
import SettingsIcon from '@mui/icons-material/Settings';
import ResultsIcon from '@mui/icons-material/BarChart';
import SaveIcon from '@mui/icons-material/Save';
import MoreIcon from '@mui/icons-material/MoreHoriz';

const HowToUse: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          py: { xs: 2, md: 4 },
          pt: { xs: '64px', md: '80px' },
          pb: { xs: '160px', md: '180px' },
        }}
      >
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{ color: '#1b75bc', fontWeight: 'bold', mb: 4 }}
        >
          How to Use RoofGrid UK
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Follow these simple steps to get the most out of the RoofGrid UK app:
        </Typography>

        <Box
          sx={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1508780709619-79562169bc64)',
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            p: 3,
            borderRadius: 2,
            mb: 3,
            position: 'relative',
            '&:before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0, 0, 0, 0.5)', borderRadius: 2 },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <AccountIcon sx={{ color: '#fff', mr: 2, fontSize: 40 }} />
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
              Step 1: Create an Account (Optional)
            </Typography>
          </Box>
          <Typography variant="body1" color="#fff" sx={{ position: 'relative', zIndex: 1 }}>
            - While you can use the basic features without an account, creating one allows you to save your projects and access Pro features.<br />
            - From the navigation bar, click "Sign Up" and fill in your details (e.g., email, password) to register.<br />
            - After signing up, log in using the "Login" link.
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1517430816045-df4b7de11d1d)',
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            p: 3,
            borderRadius: 2,
            mb: 3,
            position: 'relative',
            '&:before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0, 0, 0, 0.5)', borderRadius: 2 },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <CalcIcon sx={{ color: '#fff', mr: 2, fontSize: 40 }} />
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
              Step 2: Access the Calculator
            </Typography>
          </Box>
          <Typography variant="body1" color="#fff" sx={{ position: 'relative', zIndex: 1 }}>
            - From the home page or navigation bar, click "Calculator" to start a new roofing calculation.<br />
            - You’ll see a stepper with four stages: "Choose Tile" (or "Tile Data" for free users), "Roof Dimensions", "Settings", and "Results".
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1504307651254-35680f356dfd)',
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            p: 3,
            borderRadius: 2,
            mb: 3,
            position: 'relative',
            '&:before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0, 0, 0, 0.5)', borderRadius: 2 },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <TileIcon sx={{ color: '#fff', mr: 2, fontSize: 40 }} />
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
              Step 3: Choose Tile / Input Tile Data
            </Typography>
          </Box>
          <Typography variant="body1" color="#fff" sx={{ position: 'relative', zIndex: 1 }}>
            - <strong>For Pro Users:</strong><br />
              - Use the "Select Tile" dropdown to choose from the tile library or your saved custom tiles.<br />
              - Alternatively, expand the "Input Custom Tile" accordion and enter details like "Tile Name", "Material Type" (e.g., Slate, Tile), "Tile Length (mm)", and "Tile Width (mm)".<br />
              - Optionally, set "Min Gauge", "Max Gauge", "Min Spacing", and "Max Spacing".<br />
              - Click "Save Custom Tile" to store it for future use.<br />
            - <strong>For Free Users:</strong><br />
              - Expand the "Tile Data" accordion and manually input the tile details as above (no saving option).<br />
            - Click "Next" to proceed.
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1508775707796-c3f80d7fed46)',
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            p: 3,
            borderRadius: 2,
            mb: 3,
            position: 'relative',
            '&:before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0, 0, 0, 0.5)', borderRadius: 2 },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <DimensionsIcon sx={{ color: '#fff', mr: 2, fontSize: 40 }} />
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
              Step 4: Enter Roof Dimensions
            </Typography>
          </Box>
          <Typography variant="body1" color="#fff" sx={{ position: 'relative', zIndex: 1 }}>
            - <strong>Vertical Dimensions:</strong><br />
              - Expand the "Vertical" accordion and input "Rafter Height 1 (mm)". Add more rafters with "Add Another Rafter Height" if needed.<br />
              - For Pro users, optionally name each rafter (e.g., "Front Slope").<br />
              - Enter the "Gutter Overhang (mm)" (default is 50mm).<br />
            - <strong>Horizontal Dimensions:</strong><br />
              - Expand the "Horizontal" accordion and input "Width 1 (mm)". Add more widths with "Add Another Width" if necessary.<br />
              - For Pro users, optionally name each width (e.g., "Main Section").<br />
            - Click "Next" to continue.
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1519389950473-47ba0277781c)',
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            p: 3,
            borderRadius: 2,
            mb: 3,
            position: 'relative',
            '&:before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0, 0, 0, 0.5)', borderRadius: 2 },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <SettingsIcon sx={{ color: '#fff', mr: 2, fontSize: 40 }} />
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
              Step 5: Configure Settings
            </Typography>
          </Box>
          <Typography variant="body1" color="#fff" sx={{ position: 'relative', zIndex: 1 }}>
            - Choose "Ridge Type" (e.g., "Dry Ridge" or "Wet Ridge") from the dropdown.<br />
            - Select "Left Verge Type" and "Right Verge Type" (e.g., "Wet", "Dry", or "Abutment").<br />
            - Set "Use LH Tile" to "Yes" or "No" if applicable (disabled for abutments).<br />
            - Click "Next" to move to the results step.
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1556740738-b6a63e27c4df)',
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            p: 3,
            borderRadius: 2,
            mb: 3,
            position: 'relative',
            '&:before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0, 0, 0, 0.5)', borderRadius: 2 },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <ResultsIcon sx={{ color: '#fff', mr: 2, fontSize: 40 }} />
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
              Step 6: Calculate and View Results
            </Typography>
          </Box>
          <Typography variant="body1" color="#fff" sx={{ position: 'relative', zIndex: 1 }}>
            - Click "Calculate Roof" to process your inputs.<br />
            - Review the results in expandable sections: "Tile Data", "Settings", "Vertical Results", "Horizontal Results", and "Total Results".<br />
            - Check details like batten gauge, total tiles, and half tiles required.
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1454165804606-c3d57bc86b40)',
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            p: 3,
            borderRadius: 2,
            mb: 3,
            position: 'relative',
            '&:before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0, 0, 0, 0.5)', borderRadius: 2 },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <SaveIcon sx={{ color: '#fff', mr: 2, fontSize: 40 }} />
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
              Step 7: Save Your Project (Pro Users)
            </Typography>
          </Box>
          <Typography variant="body1" color="#fff" sx={{ position: 'relative', zIndex: 1 }}>
            - Enter a "Project Name" in the text field.<br />
            - Click "Save Results" to store your calculation for later use.<br />
            - Access saved projects from your profile page.
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1508780709619-79562169bc64)',
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            p: 3,
            borderRadius: 2,
            mb: 3,
            position: 'relative',
            '&:before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0, 0, 0, 0.5)', borderRadius: 2 },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <MoreIcon sx={{ color: '#fff', mr: 2, fontSize: 40 }} />
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
              Additional Features
            </Typography>
          </Box>
          <Typography variant="body1" color="#fff" sx={{ position: 'relative', zIndex: 1 }}>
            - <strong>Weather Widget:</strong> Check current weather conditions via the widget to plan your work.<br />
            - <strong>Profile Management:</strong> Update your details and manage saved projects/custom tiles from the "Profile" page (accessible via the navigation bar).
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" align="center">
          For more detailed instructions, refer to our FAQ or contact support.
        </Typography>
      </Container>
      <Footer />
    </Box>
  );
};

export default HowToUse;