import React from "react"
import { Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap';


const Metric = (props) => { 
  return (
    <>
    <Card>
      <CardBody>
      <CardTitle tag="h5">{props.title}</CardTitle>
      <CardSubtitle>{props.value}</CardSubtitle>
      </CardBody>
    </Card>
    </>
  );
}

export default Metric;