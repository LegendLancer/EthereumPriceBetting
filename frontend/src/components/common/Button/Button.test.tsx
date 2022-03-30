/* eslint-disable testing-library/prefer-screen-queries */
import { render, screen } from '@testing-library/react';
import Button from './index';

test('Button component unit test', () => {
  const display = () => {
    console.log('clicked!');
  };

  render(<Button onClick={display}>I am a Button!</Button>);
  const children = screen.getByText(/Button/i);
  expect(children).toBeInTheDocument();
});
