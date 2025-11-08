import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SystemBar } from '../SystemBar';

describe('SystemBar', () => {
  it('renders time in HH:MM format', () => {
    const testDate = new Date('2024-11-08T14:30:00');
    render(<SystemBar currentTime={testDate} />);

    const timeElement = screen.getByText('14:30');
    expect(timeElement).toBeInTheDocument();
  });

  it('renders date in correct format', () => {
    const testDate = new Date('2024-11-08T14:30:00'); // Friday
    render(<SystemBar currentTime={testDate} showNotch={true} />);

    const dateElement = screen.getByText('Fri, Nov 8');
    expect(dateElement).toBeInTheDocument();
  });

  it('renders status icons', () => {
    const testDate = new Date('2024-11-08T14:30:00');
    render(<SystemBar currentTime={testDate} />);

    expect(screen.getByLabelText(/signal strength/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/wifi/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/battery/i)).toBeInTheDocument();
  });

  it('hides date when showNotch is false', () => {
    const testDate = new Date('2024-11-08T14:30:00');
    render(<SystemBar currentTime={testDate} showNotch={false} />);

    expect(screen.queryByText('Fri, Nov 8')).not.toBeInTheDocument();
  });
});
