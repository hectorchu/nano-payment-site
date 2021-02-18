import React from 'react';
import {Container, Tab, Tabs} from 'react-bootstrap';
import Api from './Api';
import Payment from './Payment';

function Spacer() {
  return <div style={{marginTop: 20}} />;
}

export default function App() {
  const handleSelect = key => {
    if (key == 'woo') {
      window.location = 'https://wordpress.org/plugins/wc-gateway-gonano';
    }
  }
  return (
    <Container>
      <Spacer />
      <h1>Gonano Payments</h1>
      <Spacer />

      <Tabs defaultActiveKey="demo" onSelect={handleSelect}>
        <Tab eventKey="demo" title="Demo">
          <Spacer />
          <Payment />
          <Spacer />
        </Tab>
        <Tab eventKey="api" title="API">
          <Api />
        </Tab>
        <Tab eventKey="woo" title="WooCommerce" />
      </Tabs>
    </Container>
  );
}
