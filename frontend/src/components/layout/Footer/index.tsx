import React from 'react';
import styled from 'styled-components';

const FooterComponent = styled.div`
  width: 100%;
  height: 80px;
  background-color: #58427c;
  background-image: linear-gradient(316deg, #58427c 0%, #746cc0 74%);
`;
const Footer = () => {
  return <FooterComponent />;
};

export default Footer;
