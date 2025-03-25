import { render, screen } from '@testing-library/react';
import Calculator from '../components/Calculator';

describe('Calculator', () => {
  it('renders without crashing', () => {
    render(<Calculator />);
    expect(screen.getByText(/Roofing Calculator/i)).toBeInTheDocument();
  });
});