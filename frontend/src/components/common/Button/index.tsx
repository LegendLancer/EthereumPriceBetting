import React, { ReactChildren, ReactChild } from 'react';
import styled from 'styled-components';

interface AuxProps {
  children: ReactChild | ReactChildren;
  onClick: any;
}
const Btn = styled.button`
  display: flex;
  width: 150px;
  height: 50px;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  border-radius: 1rem;
  color: white;
  background-color: #726cf8;
  background-image: linear-gradient(315deg, #726cf8 0%, #e975a8 74%);
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  border: none;
  outline: 0;
`;

const Button = ({ children, onClick }: AuxProps) => {
  return <Btn onClick={onClick}>{children}</Btn>;
};

export default Button;
