import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SpeedIcon from '@mui/icons-material/Speed';
import PrecisionIcon from '@mui/icons-material/PrecisionManufacturing';
import PhoneIcon from '@mui/icons-material/PhoneAndroid';
import StarIcon from '@mui/icons-material/Star';
import MoneyIcon from '@mui/icons-material/MonetizationOn';
import DecisionIcon from '@mui/icons-material/Assessment';

const AppBenefits: React.FC = () => {
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
          Benefits of Using RoofGrid UK
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          RoofGrid UK is designed to streamline your roofing projects, providing accurate calculations and a user-friendly interface that saves you time and effort. Whether you're a professional roofer or a DIY enthusiast, our app offers numerous advantages:
        </Typography>

        <Box
          sx={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1504307651254-35680f356dfd)', // Replace with your image
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            p: 3,
            borderRadius: 2,
            mb: 3,
            position: 'relative',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0, 0, 0, 0.5)', // Overlay for readability
              borderRadius: 2,
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <SpeedIcon sx={{ color: '#fff', mr: 2, fontSize: 40 }} />
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
              1. Speed Up Your Workflow
            </Typography>
          </Box>
          <Typography variant="body1" color="#fff" sx={{ position: 'relative', zIndex: 1 }}>
            - <strong>Automated Calculations</strong>: Say goodbye to manual calculations. Our app quickly computes the number of tiles needed, batten spacing, and more, based on your inputs.<br />
            - <strong>Efficient Project Management</strong>: For Pro users, save and manage multiple projects, allowing you to switch between tasks seamlessly.
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
            <PrecisionIcon sx={{ color: '#fff', mr: 2, fontSize: 40 }} />
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
              2. Accurate and Reliable Results
            </Typography>
          </Box>
          <Typography variant="body1" color="#fff" sx={{ position: 'relative', zIndex: 1 }}>
            - <strong>Precision Engineering</strong>: Our calculations are based on industry standards and best practices, ensuring your roofing projects meet quality expectations.<br />
            - <strong>Custom Tile Data</strong>: Input specific tile dimensions or select from our extensive library to get precise results tailored to your materials.
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
            <PhoneIcon sx={{ color: '#fff', mr: 2, fontSize: 40 }} />
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
              3. Mobile-Friendly Design
            </Typography>
          </Box>
          <Typography variant="body1" color="#fff" sx={{ position: 'relative', zIndex: 1 }}>
            - <strong>Access Anywhere</strong>: Use the app on your smartphone or tablet while on-site, making it easy to adjust plans and calculations in real-time.<br />
            - <strong>Intuitive Interface</strong>: Navigate through the app effortlessly with a clean and straightforward design.
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
            <StarIcon sx={{ color: '#fff', mr: 2, fontSize: 40 }} />
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
              4. Pro Features for Advanced Users
            </Typography>
          </Box>
          <Typography variant="body1" color="#fff" sx={{ position: 'relative', zIndex: 1 }}>
            - <strong>Save Custom Tiles</strong>: Create and store your own tile profiles for quick access in future projects.<br />
            - <strong>Project Saving</strong>: Keep track of multiple projects, each with their own set of calculations and settings.<br />
            - <strong>Comprehensive Tile Library</strong>: Access a wide range of pre-defined tiles, saving you time on data entry.
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
            <MoneyIcon sx={{ color: '#fff', mr: 2, fontSize: 40 }} />
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
              5. Cost-Effective Solution
            </Typography>
          </Box>
          <Typography variant="body1" color="#fff" sx={{ position: 'relative', zIndex: 1 }}>
            - <strong>Free Basic Access</strong>: Get started with essential features at no cost.<br />
            - <strong>Affordable Pro Subscription</strong>: Unlock advanced features with a small monthly fee, providing excellent value for professional roofers.
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
            <DecisionIcon sx={{ color: '#fff', mr: 2, fontSize: 40 }} />
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
              6. Enhanced Decision Making
            </Typography>
          </Box>
          <Typography variant="body1" color="#fff" sx={{ position: 'relative', zIndex: 1 }}>
            - <strong>Weather Integration</strong>: Check local weather conditions to plan your projects effectively.<br />
            - <strong>Detailed Results</strong>: View comprehensive calculation results, including total tiles needed, half tiles, and more.
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" align="center">
          By choosing RoofGrid UK, you're equipping yourself with a powerful tool that enhances productivity, ensures accuracy, and simplifies your roofing projects.
        </Typography>
      </Container>
      <Footer />
    </Box>
  );
};

export default AppBenefits;