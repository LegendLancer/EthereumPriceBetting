/* eslint-disable testing-library/prefer-screen-queries */
import { render, screen } from '@testing-library/react';
import Container from './index';

test('Conainter component unit test with children element', () => {
  render(
    <Container>
      <div>I am a CHILDREN!</div>
    </Container>
  );
  const children = screen.getByText(/CHILDREN/i);
  expect(children).toBeInTheDocument();
});
