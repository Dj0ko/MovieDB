import React from 'react';
import { Alert } from 'antd';

const ErrorMessage = () => {
  if (!navigator.onLine) {
    return <Alert message="Проверьте соединение с интернетом" type="error" closable />;
  }

  return <Alert message="Что-то пошло не так" type="error" closable />;
};

export default ErrorMessage;
