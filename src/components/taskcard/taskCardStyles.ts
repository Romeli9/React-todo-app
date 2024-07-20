import { styled } from "styled-components";

export const TaskCard = styled.div`
  position: relative;
  width: 40vw;
  margin-top: 2vh;
  background-color: #9d69de;
  padding: 8px;
  border-radius: 15px;
`;

export const TaskCard__text = styled.p`
  font-size: 14px;
  width: 20vw;
  word-break: break-all;
  margin: 0 0 0 8px;
  &:first-child {
    margin-top: 5px;
  }
`;

export const TaskButtonFavoriteWrapper = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
`;