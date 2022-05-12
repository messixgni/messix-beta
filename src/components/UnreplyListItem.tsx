import React, { useEffect } from "react";
import { Col, Row, Form } from "react-bootstrap";
import { db } from "../db";
import { ChatworkRoomTable } from "../interface/dbTable";

type UnreplyListItemProps = {
  chatworkRoom: ChatworkRoomTable;
  onChangeToNormal?: (chatworkRoomTable: ChatworkRoomTable) => void;
};

const UnreplyListItem = ({ chatworkRoom, onChangeToNormal }: UnreplyListItemProps) => {
  useEffect(() => {
    //あとでhookにする
    const getLatestMessage = async () => { };
    getLatestMessage();
  }, []);
  return (
    <Form className="w-100 d-inline-block">
      <Form.Group>
        <Form.Label className="m-auto w-100">
          <Row className="align-items-center py-0">
            <Col xs={"auto"}>
              <Form.Check
                type={'radio'}
                id={`${chatworkRoom.rid}-radio`}
              ></Form.Check>
            </Col>
            <Col className="d-inline-block align-items-center" xs={4}>
              <div className="mx-auto">
                <p className="small fw-bold m-0 text-truncate">{chatworkRoom.name}</p>
                <p className="m-0 text-truncate">メッセージ長文はhidden</p>
              </div>
            </Col>
            <Col className="align-items-center text-secondary" xs={"auto"}>
              12:54
            </Col>
            <Col className="align-items-center" xs={"auto"}>
              <p className="small text-danger m-0">15分前に受信しました。<br></br>返信忘れてませんか？</p>
            </Col>
          </Row>
        </Form.Label>
      </Form.Group>
    </Form>
  );
};

export default UnreplyListItem;
