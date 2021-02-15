import React, {useState} from 'react';
import {Alert, Button, Col, Form, InputGroup} from 'react-bootstrap';
import {NanoPaymentModal} from 'react-nano-payment';

export default function Payment() {
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [show, setShow] = useState(false);
  const [blockHash, setBlockHash] = useState('');
  const [error, setError] = useState();

  const handleSubmit = e => {
    e.preventDefault();
    setShow(true);
    setBlockHash('');
    setError();
  }
  const handleSuccess = res => {
    setShow(false);
    setBlockHash(res.block_hash);
  }
  const handleError = err => {
    setShow(false);
    setError(err);
  }

  return (
    <div>
      <p>
        Gonano Payments is an easy-to-use payment processor for NANO that is free to use by the community.
      </p>
      <p>
        This lets you easily accept payments on your website without needing to know the details of how NANO works or needing to setup a NANO node, manage wallet keys or how to use the RPCs.
      </p>
      <p>
        Intermediate wallet addresses are set-up automatically for your customers to pay into, and the proceeds are automatically forwarded to your destination account.
      </p>
      <p>
        Try out a small demo below, simply input the address you'd like to receive payment on and the amount.
      </p>

      {blockHash && !error &&
        <Alert variant="success" onClose={() => setBlockHash('')} dismissible>
          Received with block hash{' '}
          <Alert.Link target="_blank" href={'https://nanolooker.com/block/'+blockHash}>
            {blockHash.slice(0,8)+'…'+blockHash.slice(-8)}
          </Alert.Link>
        </Alert>
      }

      {error &&
        <Alert variant="danger" onClose={() => setError()} dismissible>
          Error: {error.message}
        </Alert>
      }

      <Form onSubmit={handleSubmit}>
        <Form.Group as={Form.Row}>
          <Form.Label column sm="2">Account to receive on</Form.Label>
          <Col sm="7">
            <Form.Control
              type="text"
              placeholder="Account"
              value={account}
              onChange={e => setAccount(e.target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Form.Row}>
          <Form.Label column sm="2">Amount to receive</Form.Label>
          <Col sm="7">
            <InputGroup>
              <Form.Control
                type="number"
                lang="en"
                min="0"
                step="0.000001"
                placeholder="Amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
              <InputGroup.Append>
                <InputGroup.Text>NANO</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Form.Group>
        <Button variant="primary" type="submit" disabled={!account || amount <= 0}>Submit payment request</Button>
      </Form>

      <NanoPaymentModal
        account={account}
        amount={amount}
        show={show}
        onClose={() => setShow(false)}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
}
