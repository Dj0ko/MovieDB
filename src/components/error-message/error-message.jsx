import React from 'react';
import { Alert } from 'antd';

const ErrorMessage = () => (
  <Alert
    message="Что-то пошло не так"
    // description="Error Description Error Description Error Description Error Description Error Description Error Description"
    type="error"
    closable
    // onClose={onClose}
  />
);

export default ErrorMessage;
