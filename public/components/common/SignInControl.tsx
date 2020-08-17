import "./SignInControl.scss";

import React, { useState } from "react";
import { SocialSignInButton, Form, Button, Input, Message, PrivacyPolicy } from "@fider/components";
import { device, actions, Failure, isCookieEnabled } from "@fider/services";
import { useFider } from "@fider/hooks";
import { Checkbox } from './form/Checkbox';

interface SignInControlProps {
  useEmail: boolean;
  redirectTo?: string;
  onEmailSent?: (email: string) => void;
}

export const SignInControl: React.FunctionComponent<SignInControlProps> = props => {
  const fider = useFider();
  const [email, setEmail] = useState("");
  const [gdprFlag, setGdprFlag] = useState(false);
  const [error, setError] = useState<Failure | undefined>(undefined);

  const signIn = async () => {
    const result = await actions.signIn(email);
    if (result.ok) {
      setEmail("");
      setError(undefined);
      if (props.onEmailSent) {
        props.onEmailSent(email);
      }
    } else if (result.error) {
      setError(result.error);
    }
  };

  const providersLen = fider.settings.oauth.length;

  if (!isCookieEnabled()) {
    return (
      <Message type="error">
        <h3>Cookies Required</h3>
        <p>Cookies are not enabled on your browser. Please enable cookies in your browser preferences to continue.</p>
      </Message>
    );
  }

  return (
    <div className="c-signin-control">
      {providersLen > 0 && (
        <div className="l-signin-social">
          <div className="row">
            {fider.settings.oauth.map((o, i) => (
              <React.Fragment key={o.provider}>
                {i % 4 === 0 && <div className="col-lf" />}
                <div
                  className={`col-sm l-provider-${o.provider} l-social-col ${
                    providersLen === 1 ? "l-social-col-100" : ""
                  }`}
                >
                  <SocialSignInButton option={o} redirectTo={props.redirectTo} />
                </div>
              </React.Fragment>
            ))}
          </div>
          <p className="info">We will never post to these accounts on your behalf.</p>
        </div>
      )}

      {providersLen > 0 && <div className="c-divider">OR</div>}

      {props.useEmail && (
        <div className="l-signin-email">
          <p>Enter your email address to sign in</p>
          <Form error={error}>
            <Input
              field="email"
              value={email}
              autoFocus={!device.isTouch()}
              onChange={setEmail}
              placeholder="yourname@example.com"
              suffix={
                <Button type="submit" color="positive" disabled={email === "" || !gdprFlag} onClick={signIn}>
                  Sign in
                </Button>
              }
            />
            
            <Checkbox field="gdprConsent" onChange={setGdprFlag}>
              I consent for my personal data (including name, email address, and web site) to be used in accordance with this site's <PrivacyPolicy />.
              Your name and web site will be publicly visible with your comments, but Laminar Research will never share your email address with third parties.</Checkbox>
          </Form>
        </div>
      )}
    </div>
  );
};
