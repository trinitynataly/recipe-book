import React from 'react';
import PropTypes from 'prop-types';

const Toast = ({ title, text, type }) => {
  const typeStyles = {
    confirm: 'bg-green-500',
    warn: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${typeStyles[type]} text-white`}>
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
};

Toast.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['confirm', 'warn', 'error']).isRequired,
};

export default Toast;
