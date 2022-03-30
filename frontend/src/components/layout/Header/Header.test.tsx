/* eslint-disable testing-library/prefer-screen-queries */
import { render, screen } from '@testing-library/react';
import Header from './index';

test('Header component: display connect button', () => {
  render(<Header />);
  const walletConnectBtn = screen.getByText(/CONNECT/i);
  expect(walletConnectBtn).toBeInTheDocument();
});
