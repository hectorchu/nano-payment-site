import React, {useState} from 'react';
import {Alert, Button, Col, Form} from 'react-bootstrap';
import NanoPayment from './NanoPayment';

let controller = new AbortController();

function postData(url, data) {
  return fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
    signal: controller.signal,
  }).then(resp => {
    if (resp.status != 200) {
      return resp.text().then(data => {
        throw new Error(data);
      });
    }
    return resp.json();
  });
}

export default function Payment() {
  const [account, setAccount] = useState("");
  const [account2, setAccount2] = useState("");
  const [amount, setAmount] = useState("");
  const [show, setShow] = useState(false);
  const [blockHash, setBlockHash] = useState("");
  const [error, setError] = useState();

  const waitForPayment = id =>
    postData('/payment/wait', {id}).then(data => {
      setShow(false);
      setBlockHash(data['block_hash']);
    }).catch(err => {
      if (err.name != 'AbortError') {
        return new Promise(resolve =>
          setTimeout(resolve, 3000)
        ).then(() => waitForPayment(id));
      }
    });

  const handleSubmit = e => {
    e.preventDefault();
    controller = new AbortController();
    postData('/payment/new', {account, amount}).then(data => {
      setAccount2(data.account);
      setShow(true);
      setBlockHash("");
      setError();
      return waitForPayment(data.id);
    }).catch(setError);
  }

  const handleClose = () => {
    setShow(false);
    controller.abort();
  }

  return (
    <div>
      {blockHash &&
        <Alert variant="success" onClose={() => setBlockHash("")} dismissible>
          Received with block hash{' '}
          <Alert.Link target="_blank" href={"https://nanolooker.com/block/"+blockHash}>{blockHash}</Alert.Link>
        </Alert>
      }

      {error &&
        <Alert variant="danger" onClose={() => setError()} dismissible>
          Error: {error.message}
        </Alert>
      }

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
            <Form.Control
              type="number"
              lang="en"
              min="0"
              step="0.000001"
              placeholder="Amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </Col>
          <Form.Label column sm="2">NANO</Form.Label>
        </Form.Group>
        <Button variant="primary" type="submit" disabled={!account || amount <= 0}>Submit payment request</Button>
      </Form>

      <NanoPayment account={account2} amount={amount} show={show} onClose={handleClose} />
    </div>
  );
}
