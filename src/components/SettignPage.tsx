import React from "react";
import { Form } from "react-bootstrap";

const SettingPage = () => {
  return (
    <>
      <Form>
        <Form.Switch type="switch" label="〇〇ワークスペース" checked={true} />
      </Form>
    </>
  );
};

export default SettingPage;
