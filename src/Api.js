import React from 'react';
import {RedocStandalone} from 'redoc';

export default function Api() {
  return (
    <RedocStandalone specUrl="/api.yaml" />
  )
}
