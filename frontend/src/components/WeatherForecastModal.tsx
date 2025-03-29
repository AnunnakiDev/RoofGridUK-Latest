import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Button,
  Box,
  FormHelperText,
} from '@mui/material';
import { WeatherForecast, ForecastDay } from '../types/weather';

interface WeatherForecastModalProps {
  forecast: WeatherForecast;
  onClose: () => void;
  onLocationChange: (lat: number, lon: number) => void;
}

const WeatherForecastModal: React.FC<WeatherForecastModalProps> = ({ forecast, onClose, onLocationChange }) => {
  const [postcode, setPostcode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handlePostcodeSubmit = async () => {
    if (!postcode) {
      setError('Please enter a postcode');
      return;
    }

    try {
      const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`);
      const data = await response.json();

      if (data.status !== 200 || !data.result) {
        setError('Invalid postcode');
        return;
      }

      const { latitude, longitude } = data.result;
      onLocationChange(latitude, longitude);
      setError(null);
      setPostcode('');
    } catch (err) {
      console.error('Postcode fetch failed:', err);
      setError('Failed to fetch location. Please try again.');
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>5-Day Forecast</DialogTitle>
      <DialogContent>
        {/* Postcode Input */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 1,
            mb: 2,
          }}
        >
          <TextField
            label="UK Postcode"
            placeholder="e.g., SW1A 1AA"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            size="small"
            error={!!error}
            fullWidth
            inputProps={{ 'aria-label': 'UK Postcode' }}
            sx={{
              flex: 1,
              minWidth: { xs: '100%', sm: '250px' }, // Ensure enough width for placeholder
            }}
          />
          <Button
            variant="contained"
            onClick={handlePostcodeSubmit}
            sx={{
              bgcolor: '#1b75bc',
              color: 'white',
              '&:hover': { bgcolor: '#1565a0' },
              whiteSpace: 'nowrap',
            }}
          >
            Update Location
          </Button>
        </Box>
        {error && (
          <FormHelperText error sx={{ mb: 2 }}>
            {error}
          </FormHelperText>
        )}
        {/* Forecast Table */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Weather</TableCell>
              <TableCell>Temp</TableCell>
              <TableCell>Rain</TableCell>
              <TableCell>Wind</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {forecast.days.map((day: ForecastDay) => (
              <TableRow key={day.date}>
                <TableCell>{new Date(day.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })}</TableCell>
                <TableCell>
                  <img
                    src={`/weather-icons/${day.icon}.png`}
                    alt="Weather icon"
                    style={{ width: 64, height: 64 }} // Already set to 64px
                  />
                </TableCell>
                <TableCell>{day.tempHigh}/{day.tempLow}°C</TableCell>
                <TableCell>{day.precipChance}%</TableCell>
                <TableCell>{day.windSpeed} mph</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default WeatherForecastModal;