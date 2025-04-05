import React from 'react';
import { Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Import Delete icon
import UndoIcon from '@mui/icons-material/Undo'; // Import Undo icon

// Define the props interface for the Keypad component
interface KeypadProps {
  onInput: (value: string) => void;
  onEnter: () => void;
  onDelete: () => void;
  onUndo: () => void;
  onBack?: () => void; // Optional prop for TileDataEntry
  isCalculate: boolean;
}

const Keypad: React.FC<KeypadProps> = ({
  onInput,
  onEnter,
  onDelete,
  onUndo,
  onBack,
  isCalculate,
}) => {
  // Debugging: Log to confirm the component is rendering
  console.log('Keypad component rendered with isCalculate:', isCalculate);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)', // 4 columns for the keypad
        gap: 1, // Space between buttons
        padding: 1,
        backgroundColor: '#f0f0f0 !important', // Light gray background for the keypad
        borderRadius: '8px', // Rounded corners
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow
        border: '5px solid red !important', // Debugging: Red border to confirm rendering
      }}
    >
      {/* Numbers 7, 8, 9, Delete */}
      {['7', '8', '9'].map((label) => (
        <Button
          key={label}
          variant="contained"
          sx={{
            minWidth: 0,
            width: '60px !important', // Fixed width
            height: '60px !important', // Fixed height
            fontSize: '24px !important', // Larger numbers
            fontWeight: 'bold !important', // Bold numbers
            backgroundColor: 'purple !important', // Debugging: Purple background to confirm rendering
            color: '#000000 !important', // Black text
            border: '1px solid #ccc !important', // Light border
            borderRadius: '8px !important', // Rounded corners
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1) !important', // Subtle shadow
            '&:hover': {
              backgroundColor: '#e0e0e0 !important', // Light gray on hover
            },
          }}
          onClick={() => onInput(label)}
        >
          {label}
        </Button>
      ))}
      <Button
        variant="contained"
        sx={{
          minWidth: 0,
          width: '60px !important',
          height: '60px !important',
          backgroundColor: 'purple !important', // Debugging: Purple background
          color: '#000000 !important',
          border: '1px solid #ccc !important',
          borderRadius: '8px !important',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1) !important',
          '&:hover': {
            backgroundColor: '#e0e0e0 !important',
          },
        }}
        onClick={onDelete}
      >
        <DeleteIcon sx={{ fontSize: '24px !important' }} /> {/* Delete icon */}
      </Button>

      {/* Numbers 4, 5, 6, Back */}
      {['4', '5', '6'].map((label) => (
        <Button
          key={label}
          variant="contained"
          sx={{
            minWidth: 0,
            width: '60px !important',
            height: '60px !important',
            fontSize: '24px !important',
            fontWeight: 'bold !important',
            backgroundColor: 'purple !important', // Debugging: Purple background
            color: '#000000 !important',
            border: '1px solid #ccc !important',
            borderRadius: '8px !important',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1) !important',
            '&:hover': {
              backgroundColor: '#e0e0e0 !important',
            },
          }}
          onClick={() => onInput(label)}
        >
          {label}
        </Button>
      ))}
      {onBack ? (
        <Button
          variant="contained"
          sx={{
            minWidth: 0,
            width: '60px !important',
            height: '60px !important',
            fontSize: '14px !important', // Smaller text
            fontWeight: 'bold !important', // Bold text
            backgroundColor: '#1976d2 !important', // Blue background
            color: '#ffffff !important', // White text
            border: '1px solid #ccc !important',
            borderRadius: '8px !important',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1) !important',
            '&:hover': {
              backgroundColor: '#1565c0 !important', // Darker blue on hover
            },
          }}
          onClick={onBack}
        >
          Back
        </Button>
      ) : (
        <Box /> // Placeholder to maintain grid layout
      )}

      {/* Numbers 1, 2, 3, Undo */}
      {['1', '2', '3'].map((label) => (
        <Button
          key={label}
          variant="contained"
          sx={{
            minWidth: 0,
            width: '60px !important',
            height: '60px !important',
            fontSize: '24px !important',
            fontWeight: 'bold !important',
            backgroundColor: 'purple !important', // Debugging: Purple background
            color: '#000000 !important',
            border: '1px solid #ccc !important',
            borderRadius: '8px !important',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1) !important',
            '&:hover': {
              backgroundColor: '#e0e0e0 !important',
            },
          }}
          onClick={() => onInput(label)}
        >
          {label}
        </Button>
      ))}
      <Button
        variant="contained"
        sx={{
          minWidth: 0,
          width: '60px !important',
          height: '60px !important',
          backgroundColor: 'purple !important', // Debugging: Purple background
          color: '#000000 !important',
          border: '1px solid #ccc !important',
          borderRadius: '8px !important',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1) !important',
          '&:hover': {
            backgroundColor: '#e0e0e0 !important',
          },
        }}
        onClick={onUndo}
      >
        <UndoIcon sx={{ fontSize: '24px !important' }} /> {/* Undo icon */}
      </Button>

      {/* Number 0, Enter */}
      <Button
        variant="contained"
        sx={{
          minWidth: 0,
          width: '60px !important',
          height: '60px !important',
          fontSize: '24px !important',
          fontWeight: 'bold !important',
          backgroundColor: 'purple !important', // Debugging: Purple background
          color: '#000000 !important',
          border: '1px solid #ccc !important',
          borderRadius: '8px !important',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1) !important',
          '&:hover': {
            backgroundColor: '#e0e0e0 !important',
          },
          gridColumn: 'span 2', // Span two columns
        }}
        onClick={() => onInput('0')}
      >
        0
      </Button>
      <Button
        variant="contained"
        sx={{
          minWidth: 0,
          width: '130px !important', // Two boxes wide (60px * 2 + 10px gap)
          height: '60px !important',
          fontSize: '16px !important', // Larger text
          fontWeight: 'bold !important', // Bold text
          backgroundColor: '#1976d2 !important', // Blue background
          color: '#ffffff !important', // White text
          border: '1px solid #ccc !important',
          borderRadius: '8px !important',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1) !important',
          '&:hover': {
            backgroundColor: '#1565c0 !important', // Darker blue on hover
          },
          gridColumn: 'span 2', // Span two columns
        }}
        onClick={onEnter}
      >
        {isCalculate ? 'Calculate' : 'Enter'}
      </Button>
    </Box>
  );
};

export default Keypad;