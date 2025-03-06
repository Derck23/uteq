import { useState } from 'react';

const useModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const open = (task = null) => {
    setTaskToEdit(task);
    setIsVisible(true);
  };

  const close = () => {
    setIsVisible(false);
    setTaskToEdit(null);
  };

  return { isVisible, taskToEdit, open, close };
};

export default useModal;