import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HowToUse: React.FC = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <Box
      sx={{
        flexGrow: 1,
        pt: { xs: '64px', md: '80px' },
        pb: { xs: '100px', md: '120px' },
        bgcolor: '#f5f5f5',
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: '#1b75bc',
          color: 'white',
          py: { xs: 6, md: 8 },
          textAlign: 'center',
          background: 'linear-gradient(135deg, #1b75bc 0%, #0d47a1 100%)',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '2.5rem', md: '4rem' } }}>
            How to Use RoofGrid UK
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
            A Step-by-Step Guide to Mastering Your Roofing Projects
          </Typography>
        </Container>
      </Box>

      {/* Instructions Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: '#1b75bc' }}>
          Getting Started
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          RoofGrid UK is designed to make roofing calculations easy and efficient. Whether you’re a Free user or a Pro user, this guide will walk you through the key features of the app.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          1. Create an Account
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          To get started, visit the Register page by clicking “Register” in the navigation bar. Enter your username, email, password, and choose your subscription type (Free or Pro). Once registered, log in using your email and password on the Login page.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          2. Using the Roofing Calculator
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          The Calculator is the core feature of RoofGrid UK. Follow these steps to perform a roofing calculation:
          <ul>
            <li>
              <strong>Step 1: Choose Tile / Tile Data</strong>
              <ul>
                <li>
                  <strong>Free Users:</strong> Open the “Tile Data” accordion and manually enter your tile details, such as tile name, material type, dimensions (e.g., slate tile height, tile cover width), gauge (min and max), spacing (min and max), LH tile width, and whether the tile is cross-bonded.
                </li>
                <li>
                  <strong>Pro Users:</strong> Select a tile from the dropdown menu (default tiles or your saved personal tiles). Alternatively, use the “Input Custom Tile” accordion to enter new tile data. You can save this custom tile by clicking the “Save Custom Tile” button or automatically save it by clicking “Next”.
                </li>
              </ul>
            </li>
            <li>
              <strong>Step 2: Enter Roof Dimensions</strong>
              <ul>
                <li>Input your rafter heights and widths. You can add multiple rafters dynamically as needed.</li>
                <li>Enter the gutter overhang measurement.</li>
                <li>Click “Next” to proceed.</li>
              </ul>
            </li>
            <li>
              <strong>Step 3: Configure Settings</strong>
              <ul>
                <li>Select the ridge type (Dry or Wet).</li>
                <li>Choose the left and right verge types (Wet, Dry, or Abutment).</li>
                <li>Specify whether LH tiles are used (Yes or No).</li>
                <li>Click “Next” to continue.</li>
              </ul>
            </li>
            <li>
              <strong>Step 4: View Results</strong>
              <ul>
                <li>Review the vertical results (e.g., batten gauge, ridge offset).</li>
                <li>Check the horizontal results (e.g., tiles wide, overhangs).</li>
                <li>See the total results (e.g., total courses, total tiles, half tiles).</li>
                <li>
                  <strong>Pro Users:</strong> Click “Save Results” to save the calculation as a project with a project name.
                </li>
                <li>Click “Recalculate” to start over if needed.</li>
              </ul>
            </li>
          </ul>
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          3. Managing Your Profile
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          Access your Profile page by clicking “Profile” in the navigation bar (after logging in):
          <ul>
            <li>
              <strong>View User Information:</strong> See your username, email, and subscription status.
            </li>
            <li>
              <strong>Update Profile:</strong> Use the “Update Profile” accordion to change your username, email, or password.
            </li>
            <li>
              <strong>Pro Users:</strong>
              <ul>
                <li>
                  <strong>Saved Projects:</strong> Open the “Saved Projects” accordion to view, manage, or delete your saved projects.
                </li>
                <li>
                  <strong>Custom Tiles:</strong> Open the “Custom Tiles” accordion to view, manage, or delete your saved custom tiles.
                </li>
              </ul>
            </li>
          </ul>
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          4. Using the Weather Widget
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          The Weather Widget in the navigation bar provides real-time weather data to help you plan your projects:
          <ul>
            <li>Allow geolocation access when prompted to get weather data for your current location, or enter a UK postcode to fetch weather for a specific area.</li>
            <li>View the current temperature, wind speed, and a 5-day forecast to schedule your roofing work around the weather.</li>
          </ul>
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          5. Pro Features
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          If you’re a Pro user, take advantage of these advanced features:
          <ul>
            <li>
              <strong>Save Custom Tiles:</strong> Create and save custom tiles in the Calculator for reuse in future projects.
            </li>
            <li>
              <strong>Manage Projects:</strong> Save your calculation results as projects, giving them a name for easy reference. Access them later in the Profile page.
            </li>
            <li>
              <strong>Tile Library:</strong> Use the dropdown in the Calculator to select from a library of default tiles or your saved personal tiles, saving time on data entry.
            </li>
          </ul>
        </Typography>
      </Container>
    </Box>
    <Footer />
  </Box>
);

export default HowToUse;