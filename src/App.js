import React from 'react';
import {Container, Tab, Tabs} from 'react-bootstrap';
import Api from './Api';
import Payment from './Payment';

function Spacer() {
  return <div style={{marginTop: 20}} />;
}

export default function App() {
  return (
    <Container>
      <Spacer />
      <h1>Gonano Payments</h1>
      <Spacer />

      <Tabs defaultActiveKey="demo">
        <Tab eventKey="demo" title="Demo">
          <Spacer />
          <Payment />
          <Spacer />
        </Tab>
        <Tab eventKey="api" title="API">
          <Api />
        </Tab>
      </Tabs>
    </Container>
  );
}
