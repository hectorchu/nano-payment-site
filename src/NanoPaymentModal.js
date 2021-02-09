import React, {useState, useEffect} from 'react';
import {Button, Modal} from 'react-bootstrap';
import QRCode from 'qrcode.react';
import Big from 'big.js';

async function postData(url, data, signal) {
  const resp = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
    signal,
  });
  if (resp.status != 200) {
    throw new Error(await resp.text());
  }
  return await resp.json();
}

async function waitForPayment(apiURL, id, signal) {
  while (true) {
    try {
      return await postData(`${apiURL}/payment/wait`, {id}, signal);
    } catch (err) {
      if (err.name == 'AbortError') throw err;
      await new Promise(res => setTimeout(res, 3e3));
    }
  }
}

export default function NanoPaymentModal({
  apiURL = '', account, amount, show, onClose, onSuccess, onError,
}) {
  const [account2, setAccount] = useState('');

  useEffect(() => {
    if (!show) return;
    const controller = new AbortController;
    const {signal} = controller;
    let id;

    setAccount('');
    postData(`${apiURL}/payment/new`, {account, amount}, signal)
    .then(data => {
      id = data.id;
      setAccount(data.account);
      return waitForPayment(apiURL, id, signal);
    })
    .then(res => {
      id = '';
      onSuccess(res);
    })
    .catch(err => err.name != 'AbortError' && onError(err));

    return () => {
      controller.abort();
      if (!id) return;
      postData(`${apiURL}/payment/cancel`, {id}).catch(onError);
    };
  }, [account, amount, show]);

  const link = `nano:${account2}?amount=${Big(amount||0).times(1e30).toFixed(0)}`;
  return (
    <Modal centered show={show} onHide={onClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>NANO Payment Request</Modal.Title>
      </Modal.Header>

      {account2 &&
        <Modal.Body>
          <p>Please send {amount} NANO to <pre>{account2}</pre></p>
          <a href={link}>Payment Link</a>
          <div style={{textAlign: 'center'}}>
            <QRCode value={link} />
          </div>
        </Modal.Body>
      }

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  )
}
