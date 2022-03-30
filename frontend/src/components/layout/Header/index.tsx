import React, { useEffect } from 'react';
import styled from 'styled-components';
import providerOptions from '../../../utils/Web3ProviderOptions';
import Container from '../../common/Container';
import Button from '../../common/Button';
import { useEthers, shortenAddress, useEtherBalance } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';
import Web3Modal from 'web3modal';
import { toast } from 'react-toastify';

const Head = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 100px;
  background-color: #58427c;
  background-image: linear-gradient(316deg, #58427c 0%, #746cc0 74%);
`;

const Header = () => {
  const { account, activate, deactivate } = useEthers();
  const balance = useEtherBalance(account);

  useEffect(() => {
    !account && toast.error('Account is disconnected...');
  }, [account]);

  const handleConnect = async () => {
    if (account) {
      deactivate();
      return;
    }
    const web3modal: Web3Modal = new Web3Modal({
      providerOptions,
    });
    const provider = await web3modal.connect();
    await activate(provider);
    toast.success('Successfully connected');
  };

  return (
    <Head>
      <Container>
        <Button onClick={handleConnect}>
          {!account ? (
            'CONNECT'
          ) : (
            <>
              <div>{shortenAddress(account)}</div>
              <div>{`${
                balance && parseFloat(formatEther(balance)).toFixed(2)
              } ETH`}</div>
            </>
          )}
        </Button>
      </Container>
    </Head>
  );
};

export default Header;
