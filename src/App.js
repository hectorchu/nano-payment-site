import React from 'react';
import {Container, Tab, Tabs} from 'react-bootstrap';
import Api from './Api';
import Payment from './Payment';

export default function App() {
  return (
    <Container>
      <h1>Gonano Payments</h1>
      <div style={{marginTop: 20}} />

      <Tabs defaultActiveKey="demo">
        <Tab eventKey="demo" title="Demo">
          <div style={{marginTop: 20}} />
          <Payment />
        </Tab>
        <Tab eventKey="api" title="API">
          <Api />
        </Tab>
      </Tabs>
    </Container>
  );
}
