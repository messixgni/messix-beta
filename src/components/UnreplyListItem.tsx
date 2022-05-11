import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { db } from "../db";
import { ChatworkRoomTable } from "../interface/dbTable";

type UnreplyListItemProps = {
  chatworkRoom: ChatworkRoomTable;
  onChangeToNormal?: (chatworkRoomTable: ChatworkRoomTable) => void;
};

const UnreplyListItem = ({ chatworkRoom, onChangeToNormal }: UnreplyListItemProps) => {
  useEffect(() => {
    //あとでhookにする
    const getLatestMessage = async () => {};
    getLatestMessage();
  }, []);
  return (
    <Row style={{ height: "40px" }}>
      <Col style={{ width: "20px" }}></Col>
      <Col style={{ width: "40px" }}></Col>
      <Col>
        <Col xs={6}>
          <Row>
            <p>{chatworkRoom.name}</p>
          </Row>
          <Row></Row>
        </Col>
        <Col xs={2}></Col>
        <Col xs={4}></Col>
      </Col>
    </Row>
  );
};

export default UnreplyListItem;
