import { render, screen } from '@testing-library/react';
import Calculator from '../pages/Calculator';

describe('Calculator', () => {
  it('renders without crashing', () => {
    render(<Calculator />);
    expect(screen.getByText('Roofing Calculator')).toBeInTheDocument();
  });
});