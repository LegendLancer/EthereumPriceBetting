import React from 'react';
import { formatEther } from '@ethersproject/units';
import styled from 'styled-components';
import { useEthers } from '@usedapp/core';
import { useGetBetInfo } from '../../hooks/useBetContract';

interface BetInfoPropTypes {}

const BetInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px;
  width: 60%;
  border-radius: 1rem;
  font-size: 1.5rem;
  gap: 1rem;
  color: darkgreen;
  background-color: #4dccc6;
  background-image: linear-gradient(315deg, #4dccc6 0%, #96e4df 74%);
`;

const BetInfo = (props: BetInfoPropTypes) => {
  const { account } = useEthers();
  const betInfo = useGetBetInfo(account);
  return (
    <BetInfoWrapper>
      {betInfo && (
        <div>
          Position:{' '}
          {(betInfo?.position === 0 && 'UP') ||
            (betInfo?.position === 1 && 'DOWN') ||
            (betInfo?.position === 2 && 'Observer')}
        </div>
      )}
      {betInfo && <div>Reserve: {formatEther(betInfo?.reserveAmount)} ETH</div>}
      {betInfo && <div>Deposit: {formatEther(betInfo?.depositAmount)} ETH</div>}
    </BetInfoWrapper>
  );
};

export default BetInfo;
