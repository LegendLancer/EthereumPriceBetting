import React, { useState, useEffect } from 'react';
import { parseEther } from '@ethersproject/units';
import { useEtherBalance, useEthers } from '@usedapp/core';
import styled from 'styled-components';
import {
  useEthereumPrice,
  useBetStatus,
  usePivotPrice,
  useEndTime,
  useDeposit,
  useWithdraw,
  useExecute,
} from '../../hooks/useBetContract';
import Container from '../common/Container';
import Button from '../common/Button';
import BetInfo from './betinfo';
import Timer from './timer';
import { toast } from 'react-toastify';

const Panel = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 50px auto;
  padding: 50px 0px;
  width: 500px;
  background-color: #6247aa;
  background-image: linear-gradient(316deg, #6247aa 0%, #a594f9 74%);
  color: black;
  border-radius: 2rem;
  gap: 20px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset,
    rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
`;

interface PriceProps {
  isUp: boolean;
}

const Price = styled.div`
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  color: ${(props: PriceProps) => (props.isUp ? `yellow` : `mistyrose`)};
  border: 2px solid white;
  border-radius: 1rem;
  padding: 5px 1rem;
`;

const DepositAmount = styled.input`
  width: 100px;
  padding: 5px;
  color: pink;
  font-size: 1.5rem;
  text-align: center;
  outline: 0;
  border: 0;
  border: 2px solid gold;
  border-radius: 10px;
  background: transparent;
`;

interface StatusType {
  status: number;
}

const Status = styled.h2`
  color: ${(props: StatusType) =>
    props.status === 0 || props.status === undefined
      ? 'yellow'
      : props.status === 1
      ? 'red'
      : 'black'};
`;

const PanelTitle = styled.div`
  color: purple;
  font-weight: 700;
  font-size: 1.5rem;
`;

const PivotPrice = styled.h2`
  margin: auto 0;
  font-size: 50px;
  color: white;
`;

const BetPanel = () => {
  const [depositAmt, setDepositAmt] = useState(0);

  const { account } = useEthers();
  const accountBalance = useEtherBalance(account);
  const etherPrice = useEthereumPrice();
  const betStatus = useBetStatus();
  const pivotPrice = usePivotPrice();
  const endTime = useEndTime();
  const { send: deposit, state: depositState } = useDeposit();
  const { send: withdraw, state: withdrawState } = useWithdraw();
  const { send: execute, state: executeState } = useExecute();

  useEffect(() => {
    console.log(depositState);
    depositState.status === 'Success' && toast.success('Deposit Success');
    depositState.status === 'Exception' &&
      toast.error(depositState.errorMessage);
  }, [depositState]);

  useEffect(() => {
    withdrawState.status === 'Success' && toast.success('Withdraw Success');
    withdrawState.errorMessage && toast.error(withdrawState.errorMessage);
  }, [withdrawState]);

  useEffect(() => {
    executeState.status === 'Success' &&
      toast.success('Bet Finished Successfully');
    executeState.errorMessage && toast.error(executeState.errorMessage);
  }, [executeState]);

  const handleDeposit = () => {
    deposit({ value: parseEther(depositAmt.toString()) });
  };
  const handleChange = (e: any) => {
    setDepositAmt(e.target.value);
  };
  const handleFinish = () => {
    execute();
  };
  const handleWithdraw = () => {
    withdraw();
  };

  return (
    <Container>
      <Panel>
        <PanelTitle>ETH PRICE BETTING</PanelTitle>
        <PivotPrice>{`<${pivotPrice}$>`}</PivotPrice>
        <Status status={betStatus}>
          {betStatus === 0 || betStatus === undefined
            ? `NOT STARTED`
            : betStatus === 1
            ? 'ONGOING'
            : 'FINISHED'}
        </Status>
        <Price isUp={etherPrice > pivotPrice}>
          {`NOW: ${etherPrice?.toFixed(2) || 0} $`}
        </Price>
        {endTime && (
          <Timer
            expiryTimestamp={new Date(parseInt(endTime) * 1000)}
            handleFinish={handleFinish}
          />
        )}
        <DepositAmount
          onChange={handleChange}
          value={depositAmt}
          placeholder='ETH'
          min={0}
          max={accountBalance?.toString()}
        />
        {(betStatus === 0 && (
          <Button onClick={handleDeposit}>Deposit</Button>
        )) ||
          (betStatus === 2 && (
            <Button onClick={handleWithdraw}>Withdraw</Button>
          ))}
        <BetInfo />
      </Panel>
    </Container>
  );
};

export default BetPanel;
