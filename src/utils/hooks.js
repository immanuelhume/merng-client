import { useState } from 'react';

export const useForm = (initial = {}) => {
  const [fieldInfo, setFieldInfo] = useState(initial);
  const updateFields = (e) => {
    setFieldInfo({ ...fieldInfo, [e.target.name]: e.target.value });
  };
  return [fieldInfo, updateFields];
};
