import React from "react";
import styled from 'styled-components/native';
import List from "./List";

const Container = styled.View`
  flex: 1;
  padding: 5px;
  `
export default ({source}) => {
  return (
    <Container>
      <List lists={source} />
    </Container>
  )
};