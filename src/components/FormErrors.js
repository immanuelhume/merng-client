import React from 'react';

const FormErrors = ({ errors }) => {
  const isError = Object.keys(errors).length > 0 ? true : false;
  return (
    <>
      {isError && (
        <div className="ui error message">
          <ul>
            {Object.values(errors).map((err) => {
              return <li key={err}>{err}</li>;
            })}
          </ul>
        </div>
      )}
    </>
  );
};

export default FormErrors;
