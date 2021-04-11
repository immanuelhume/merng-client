import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useContext, useState } from 'react';
import { Button, Container, Form, Header } from 'semantic-ui-react';
import FormErrors from '../components/FormErrors';
import { AuthContext } from '../context/auth';
import { useForm } from '../utils/hooks';

const Login = (props) => {
  const { login } = useContext(AuthContext);

  const [fieldInfo, setFieldInfo] = useForm({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loginUser, { loading }] = useMutation(LOGIN_MUTATION, {
    update(cache, result) {
      login(result.data.login);
      props.history.push('/');
    },
    onError(err) {
      try {
        setErrors(err.graphQLErrors[0].extensions.errors);
      } catch (e) {
        console.log(err);
      }
    },
    variables: fieldInfo,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser();
  };

  return (
    <Container className="login-form">
      <Header size="large">Login</Header>
      <Form className={loading && 'loading'}>
        <Form.Input
          label="Username"
          type="text"
          name="username"
          required={true}
          placeholder="Username"
          value={fieldInfo.username}
          onChange={setFieldInfo}
        />
        <Form.Input
          label="Password"
          name="password"
          type="password"
          required={true}
          placeholder="Password"
          value={fieldInfo.password}
          onChange={setFieldInfo}
        />
        <Button color="teal" onClick={handleSubmit}>
          Login
        </Button>
      </Form>
      <FormErrors errors={errors} />
    </Container>
  );
};

const LOGIN_MUTATION = gql`
  mutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      email
      createdAt
      token
    }
  }
`;

export default Login;
