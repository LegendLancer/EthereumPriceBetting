import React, { ReactChildren, ReactChild } from 'react';
import styled from 'styled-components';
import { device } from './device';

const Wrapper = styled.div`
  @media ${device.laptop} {
    max-width: 800px;
  }

  @media ${device.desktop} {
    max-width: 1400px;
  }

  margin: 0 auto;
  display: flex;
  align-items: center;
`;

interface AuxProps {
  children: ReactChild | ReactChildren;
}

const Container = ({ children }: AuxProps) => {
  return <Wrapper>{children}</Wrapper>;
};

export default Container;
