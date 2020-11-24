import { render, screen } from '@testing-library/react';
import App from './App';
import SocketMock from 'socket.io-mock';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
