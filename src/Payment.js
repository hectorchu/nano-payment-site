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

  const handleSubmit = e => {
    e.preventDefault();
    controller = new AbortController();
    postData('/payment/new', {account, amount})
    .then(data => {
      setAccount2(data.account);
      setShow(true);
      setBlockHash("");
      setError();
      return postData('/payment/wait', {id: data.id});
    }).then(data => {
      setShow(false);
      setBlockHash(data['block_hash']);
    }).catch(err => {
      if (err.name != 'AbortError') setError(err);
    });
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

      <Form onSubmit={handleSubmit}>
        <Form.Group as={Form.Row}>
          <Form.Label column sm="2">Account to receive on</Form.Label>
          <Col sm="7">
            <Form.Control type="text" placeholder="Account" value={account} onChange={e => setAccount(e.target.value)} />
          </Col>
        </Form.Group>
        <Form.Group as={Form.Row}>
          <Form.Label column sm="2">Amount to receive</Form.Label>
          <Col sm="7">
            <Form.Control type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
          </Col>
          <Form.Label column sm="2">NANO</Form.Label>
        </Form.Group>
        <Button variant="primary" type="submit" disabled={!account || amount <= 0}>Submit payment request</Button>
      </Form>

      <NanoPayment account={account2} amount={amount} show={show} onClose={handleClose} />
    </div>
  );
}
