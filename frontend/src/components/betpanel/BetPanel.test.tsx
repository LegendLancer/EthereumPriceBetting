/* eslint-disable testing-library/prefer-screen-queries */
import { render, screen } from '@testing-library/react';
import BetPanel from './index';

test('BetPanel component unit testing: Renders pivot price and deposit button', () => {
  render(<BetPanel />);
  const pivotPrice = screen.getByText(/ETH PRICE BETTING/i);
  expect(pivotPrice).toBeInTheDocument();

  const status = screen.getByText(/NOT STARTED/i);
  expect(status).toBeInTheDocument();
});
