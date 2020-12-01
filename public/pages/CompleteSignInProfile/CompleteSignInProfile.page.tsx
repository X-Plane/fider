import React from "react";

import HomePage, { HomePageProps } from "../Home/Home.page";
import SignInPage from "../SignIn/SignIn.page";
import { Modal, Button, Form, Input, LegalFooter } from "@fider/components";
import { actions, Failure, querystring, Fider } from "@fider/services";

interface CompleteSignInProfilePageState {
  name: string;
  nameIsValid: boolean;
  error?: Failure;
}

export default class CompleteSignInProfilePage extends React.Component<HomePageProps, CompleteSignInProfilePageState> {
  private key: string;

  constructor(props: HomePageProps) {
    super(props);
    this.key = querystring.get("k");
    this.state = {
      name: "",
      nameIsValid: false
    };
  }

  private submit = async () => {
    const result = await actions.completeProfile(this.key, this.state.name);
    if (result.ok) {
      location.href = "/";
    } else if (result.error) {
      this.setState({ error: result.error });
    }
  };

  private setName = (name: string) => {
    let nameCheckRegex = /^[^@]+$/;
    const nameIsValid = nameCheckRegex.test(name);
    this.setState({ name, nameIsValid });
  };

  private noop = () => {
    // do nothing
  };

  public render() {
    return (
      <>
        <Modal.Window canClose={false} isOpen={true} onClose={this.noop}>
          <Modal.Header>Complete your profile</Modal.Header>
          <Modal.Content>
            <p>Because this is your first sign in, please enter your name.</p>
            <p>Please <strong>do not</strong> use an email address as your name.</p>
            <Form error={this.state.error}>
              <Input
                field="name"
                onChange={this.setName}
                maxLength={100}
                placeholder="Name"
                pattern="^[^@]+$" 
                suffix={
                  <Button type="submit" onClick={this.submit} color="positive" disabled={this.state.name === "" || !this.state.nameIsValid}>
                    Submit
                  </Button>
                }
              />
            </Form>
          </Modal.Content>
          <LegalFooter />
        </Modal.Window>
        {Fider.session.tenant.isPrivate
          ? React.createElement(SignInPage, this.props)
          : React.createElement(HomePage, this.props)}
      </>
    );
  }
}
