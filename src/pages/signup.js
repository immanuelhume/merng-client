import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Button, Container, Form, Header } from 'semantic-ui-react';
import FormErrors from '../components/FormErrors';
import { useForm } from '../utils/hooks';

const Signup = (props) => {
  const [fieldInfo, updateFields] = useForm({
    username: '',
    email: '',
    password: '',
    confirmedPassword: '',
  });

  const [errors, setErrors] = useState({});

  const [addUser, { loading }] = useMutation(SIGNUP_MUTATION, {
    update(proxy, result) {
      console.log(result);
      props.history.push('/');
    },
    onError(err) {
      try {
        console.log(err.graphQLErrors[0].extensions.errors);
        setErrors(err.graphQLErrors[0].extensions.errors);
      } catch (err) {}
    },
    variables: fieldInfo,
  });

  function handleSignUp(e) {
    console.log(fieldInfo);
    e.preventDefault();
    addUser();
  }

  return (
    <Container text>
      <Header size="large">Sign Up For A New Account</Header>
      <Form className={loading && 'loading'}>
        <Form.Group widths="equal">
          <Form.Input
            type="text"
            label="Username"
            name="username"
            placeholder="Username"
            required={true}
            onChange={updateFields}
            value={fieldInfo.username}
            error={errors.username ? true : false}
          />
          <Form.Input
            type="email"
            label="Email"
            name="email"
            placeholder="Email"
            required={true}
            onChange={updateFields}
            value={fieldInfo.email}
            error={errors.email ? true : false}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            type="password"
            label="Password"
            name="password"
            placeholder="Password"
            required={true}
            onChange={updateFields}
            value={fieldInfo.password}
            error={errors.password ? true : false}
          />
          <Form.Input
            type="password"
            label="Confirm Password"
            name="confirmedPassword"
            placeholder="Confirm password"
            required={true}
            onChange={updateFields}
            value={fieldInfo.confirmedPassword}
          />
        </Form.Group>
        <Button color="teal" className="signup-btn" onClick={handleSignUp}>
          Sign Up
        </Button>
      </Form>
      <FormErrors errors={errors} />
    </Container>
  );
};

const SIGNUP_MUTATION = gql`
  mutation signup(
    $username: String!
    $email: String!
    $password: String!
    $confirmedPassword: String!
  ) {
    register(
      registrationInput: {
        username: $username
        email: $email
        password: $password
        confirmedPassword: $confirmedPassword
      }
    ) {
      id
      username
      email
      createdAt
      token
    }
  }
`;

export default Signup;
