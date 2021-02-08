import React from 'react';
import { Spin, Space } from 'antd';

import './spinner.css';

const Spinner = () => (
  <Space size="middle">
    <Spin size="large" />
  </Space>
);

export default Spinner;
