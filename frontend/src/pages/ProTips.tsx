import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MeasureIcon from '@mui/icons-material/Straighten';
import TileIcon from '@mui/icons-material/ViewModule';
import ProjectIcon from '@mui/icons-material/Folder';
import WeatherIcon from '@mui/icons-material/WbSunny';
import SettingsIcon from '@mui/icons-material/Settings';
import BondIcon from '@mui/icons-material/Link';
import ProIcon from '@mui/icons-material/Star';
import UpdateIcon from '@mui/icons-material/Update';

const ProTips: React.FC = () => {
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
          Pro Tips for Roofing Professionals
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Maximize your efficiency and accuracy with these expert tips:
        </Typography>

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
            <MeasureIcon sx={{ color: '#fff', mr: 2, fontSize: 40 }} />
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
              1. Accurate Measurements
            </Typography>
          </Box>
          <Typography variant="body1" color="#fff" sx={{ position: 'relative', zIndex: 1 }}>
            - Always double-check your rafter heights and widths in the "Roof Dimensions" step to ensure precise calculations.<br />
            - Consider architectural features (e.g., dormers, chimneys) that might affect the roofing layout and adjust your inputs accordingly.
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
            <TileIcon sx={{ color: '#fff', mr: 2, fontSize: 40 }} />
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
              2. Custom Tiles
            </Typography>
          </Box>
          <Typography variant="body1" color="#fff" sx={{ position: 'relative', zIndex: 1 }}>
            - For unique projects, create custom tile profiles in the "Choose Tile" step and save them with "Save Custom Tile" for reuse.<br />
            - Organize your custom tiles with descriptive names (e.g., "Slate 500x250") for easy selection in the dropdown.
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
            <ProjectIcon sx={{ color: '#fff', mr: 2, fontSize: 40 }} />
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
              3. Project Management
            </Typography>
          </Box>
          <Typography variant="body1" color="#fff" sx={{ position: 'relative', zIndex: 1 }}>
            - Use the "Save Results" feature in the "Results" step to track multiple jobs simultaneously.<br />
            - Label projects clearly (e.g., "Smith Residence - Front Roof") to avoid confusion when managing several clients or sites.
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
            <WeatherIcon sx={{ color: '#fff', mr: 2, fontSize: 40 }} />
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
              4. Weather Planning
            </Typography>
          </Box>
          <Typography variant="body1" color="#fff" sx={{ position: 'relative', zIndex: 1 }}>
            - Check the weather widget regularly to schedule work during optimal conditions.<br />
            - Prepare for unexpected changes by having contingency plans, such as covering unfinished sections.
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
            <SettingsIcon sx={{ color: '#fff', mr: 2, fontSize: 40 }} />
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
              5. Settings Configuration
            </Typography>
          </Box>
          <Typography variant="body1" color="#fff" sx={{ position: 'relative', zIndex: 1 }}>
            - <strong>Ridge Type:</strong> Choose "Dry Ridge" in the "Settings" step for a quicker, mortar-free installation with improved durability.<br />
            - <strong>Verge Types:</strong> Select "Dry Verge" for a low-maintenance edge, or "Wet Verge" for traditional mortar bedding.<br />
            - <strong>Left-Hand Tile:</strong> Use "Yes" for "Use LH Tile" if your layout needs a special tile on the left, often for aesthetics or function.
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
            <BondIcon sx={{ color: '#fff', mr: 2, fontSize: 40 }} />
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
              6. Cross-Bonding
            </Typography>
          </Box>
          <Typography variant="body1" color="#fff" sx={{ position: 'relative', zIndex: 1 }}>
            - Enable "Cross-Bonded" in the "Tile Data" accordion to use a broken bond pattern, improving weather resistance and stability.<br />
            - Ensure your tile selection supports cross-bonding if required by project specs or local standards.
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
            <ProIcon sx={{ color: '#fff', mr: 2, fontSize: 40 }} />
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
              7. Utilize Pro Features
            </Typography>
          </Box>
          <Typography variant="body1" color="#fff" sx={{ position: 'relative', zIndex: 1 }}>
            - Use the tile library in "Choose Tile" to quickly select common tiles without manual input.<br />
            - Reuse saved projects as templates by loading them from your profile, adjusting only necessary parameters.
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
            <UpdateIcon sx={{ color: '#fff', mr: 2, fontSize: 40 }} />
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
              8. Stay Updated
            </Typography>
          </Box>
          <Typography variant="body1" color="#fff" sx={{ position: 'relative', zIndex: 1 }}>
            - Keep an eye on app updates for new features and improvements.<br />
            - Provide feedback via the "Contact" page to help us enhance the app for your needs.
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" align="center">
          By following these tips, you can ensure your roofing projects are completed efficiently and to the highest standards.
        </Typography>
      </Container>
      <Footer />
    </Box>
  );
};

export default ProTips;