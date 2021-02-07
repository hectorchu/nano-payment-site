import React, {useState} from 'react';
import {Button, Modal} from 'react-bootstrap';
import QRCode from 'qrcode.react';
import Big from 'big.js';

export default function NanoPayment({account, amount, show, onClose}) {
  return (
    <Modal centered show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>NANO Payment Request</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>Please send {amount} NANO to <pre>{account}</pre></p>
        <div style={{textAlign: 'center'}}>
          <QRCode value={`nano:${account}?amount=${Big(amount||0).times(1e30).toFixed(0)}`} />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  )
}
