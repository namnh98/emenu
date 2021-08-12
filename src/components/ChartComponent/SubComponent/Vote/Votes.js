import React, { useState, useEffect, useRef } from 'react';
import { View, } from 'react-native';
import styled from 'styled-components/native';
import Progress from './Progress';
import { colors } from '../../../../assets';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


function Votes({ vote }) {
  const [numberVote, setNumberVote] = useState()
  const ListPercentVotes = useRef([])
  const countNumberRef = useRef(0)
  const listVotesRef = useRef([])

  useEffect(() => {
    _renderNumberVote()
    percentVotes(vote)
    listVotesRef.current = vote.length > 0 ? formatDataVote(ListPercentVotes.current) : []
  }, [])

  // render ngôi sao đánh giá
  const _renderRating = (ratting) => {
    if (ratting === 5) {
      return (
        <ViewRowCenter>
          {[1, 2, 3, 4, 5].map((value, index) => {
            return (
              <MaterialCommunityIcons
                name="star"
                color="orange"
                size={24}
                key={index}
              />
            );
          })}
        </ViewRowCenter>
      );
    } else if (ratting >= 4.5) {
      return (
        <ViewRowCenter>
          {[1, 2, 3, 4].map((value, index) => {
            return (
              <MaterialCommunityIcons
                name="star"
                color="orange"
                size={24}
                key={index}
              />
            );
          })}
          <MaterialCommunityIcons
            name="star-half-full"
            color="orange"
            size={24}
          />
        </ViewRowCenter>
      );
    } else if (ratting >= 4 && ratting <= 4.5) {
      return (
        <ViewRowCenter>
          {[1, 2, 3, 4].map((value, index) => {
            return (
              <MaterialCommunityIcons
                name="star"
                color="orange"
                size={24}
                key={index}
              />
            );
          })}
          <MaterialCommunityIcons
            name="star-outline"
            color="orange"
            size={24}
          />
        </ViewRowCenter>
      );
    } else if (ratting >= 3.5) {
      return (
        <ViewRowCenter>
          {[1, 2, 3].map((value, index) => {
            return (
              <MaterialCommunityIcons
                name="star"
                color="orange"
                size={24}
                key={index}
              />
            );
          })}
          <MaterialCommunityIcons
            name="star-half-full"
            color="orange"
            size={24}
          />
          <MaterialCommunityIcons
            name="star-outline"
            color="orange"
            size={24}
          />
        </ViewRowCenter>
      );
    } else if (ratting >= 3 && ratting <= 3.5) {
      return (
        <ViewRowCenter>
          {[1, 2, 3].map((value, index) => {
            return (
              <MaterialCommunityIcons
                name="star"
                color="orange"
                size={24}
                key={index}
              />
            );
          })}
          <MaterialCommunityIcons
            name="star-outline"
            color="orange"
            size={24}
          />
          <MaterialCommunityIcons
            name="star-outline"
            color="orange"
            size={24}
          />
        </ViewRowCenter>
      );
    } else if (ratting >= 2.5) {
      return (
        <ViewRowCenter>
          {[1, 2].map((value, index) => {
            return (
              <MaterialCommunityIcons
                name="star"
                color="orange"
                size={24}
                key={index}
              />
            );
          })}
          <MaterialCommunityIcons
            name="star-half-full"
            color="orange"
            size={24}
          />
          <MaterialCommunityIcons
            name="star-outline"
            color="orange"
            size={24}
          />
          <MaterialCommunityIcons
            name="star-outline"
            color="orange"
            size={24}
          />
        </ViewRowCenter>
      );
    } else if (ratting >= 2 && ratting <= 2.5) {
      return (
        <ViewRowCenter>
          {[1, 2].map((value, index) => {
            return (
              <MaterialCommunityIcons
                name="star"
                color="orange"
                size={24}
                key={index}
              />
            );
          })}
          <MaterialCommunityIcons
            name="star-outline"
            color="orange"
            size={24}
          />
          <MaterialCommunityIcons
            name="star-outline"
            color="orange"
            size={24}
          />
          <MaterialCommunityIcons
            name="star-outline"
            color="orange"
            size={24}
          />
        </ViewRowCenter>
      );
    } else if (ratting >= 1.5) {
      return (
        <ViewRowCenter>
          <MaterialCommunityIcons name="star" color="orange" size={24} />
          <MaterialCommunityIcons
            name="star-half-full"
            color="orange"
            size={24}
          />
          <MaterialCommunityIcons
            name="star-outline"
            color="orange"
            size={24}
          />
          <MaterialCommunityIcons
            name="star-outline"
            color="orange"
            size={24}
          />
          <MaterialCommunityIcons
            name="star-outline"
            color="orange"
            size={24}
          />
        </ViewRowCenter>
      );
    } else if (ratting >= 1 && ratting <= 1.5) {
      return (
        <ViewRowCenter>
          <MaterialCommunityIcons name="star" color="orange" size={24} />
          {[1, 2, 3, 4].map((value, index) => {
            return (
              <MaterialCommunityIcons
                name="star-outline"
                color="orange"
                size={24}
                key={index}
              />
            );
          })}
        </ViewRowCenter>
      );
    } else {
      return (
        <ViewRowCenter>
          {[1, 2, 3, 4, 5].map((value, index) => {
            return (
              <MaterialCommunityIcons
                name="star-outline"
                color="orange"
                size={24}
                key={index}
              />
            );
          })}
        </ViewRowCenter>
      );
    }
  };


  /**
   *
   * định dạng lại data votes
   */
  const formatDataVote = (data) => {
    let votes = [];
    if (data === undefined) return [];

    let vote5 = data.find(vote => vote.point === 5)
    let vote4 = data.find(vote => vote.point === 4)
    let vote3 = data.find(vote => vote.point === 3)
    let vote2 = data.find(vote => vote.point === 2)
    let vote1 = data.find(vote => vote.point === 1)

    if (vote5) {
      votes.push(vote5);
    } else {
      votes.push({
        point: 5,
        total: 0,
        percent: 0
      })
    }

    if (vote4) {
      votes.push(vote4);
    } else {
      votes.push({
        point: 4,
        total: 0,
        percent: 0
      })
    }

    if (vote3) {
      votes.push(vote3);
    } else {
      votes.push({
        point: 3,
        total: 0,
        percent: 0
      })
    }

    if (vote2) {
      votes.push(vote2)
    } else {
      votes.push({
        point: 2,
        total: 0,
        percent: 0
      })
    }
    if (vote1) {
      votes.push(vote1);
    } else {
      votes.push({
        point: 1,
        total: 0,
        percent: 0
      })
    }
    return votes
  }

  const percentVotes = array => {
    if (array?.length === 0) return
    let percent = 0;
    let newPercent = 0
    let newArray = []
    let itemPercent = 0
    array.map((item, index) => {
      if (index < array.length - 1) {
        itemPercent = Math.round((item.total / countNumberRef.current) * 100)
        newPercent += itemPercent
        newArray.push({ ...item, percent: itemPercent })
      } else {
        percent = 100 - newPercent
        newArray.push({ ...item, percent: percent })
      }
    })
    return ListPercentVotes.current = newArray
  }

  //tính tổng số lượt vote
  const _renderNumberVote = () => {
    let tempVote = 0;
    let totalVote = 0;
    let countTotal = 0;
    if (vote?.length > 0) {
      vote.map((item) => {
        if (item.total > 0 && item.point > 0) {
          tempVote += item.total * item.point
          countTotal += item.total;
        }
      })
      totalVote = Math.round(tempVote / vote.length)
      countNumberRef.current = countTotal
      setNumberVote(totalVote)
    }

  }

  /** khi data vote rỗng thì render mặc định 0  */
  const _renderEmptyData = () => {
    return <><View style={{ alignItems: 'center', paddingTop: 30, paddingBottom: 30 }}>
      <ViewRowEnd>
        <NumberVote>0</NumberVote>
        <TextInside>/5</TextInside>
      </ViewRowEnd>
      <ViewRowCenter>
        {[1, 2, 3, 4, 5].map((value, index) => {
          return (
            <MaterialCommunityIcons
              name="star-outline"
              color="orange"
              size={24}
              key={index}
            />
          );
        })}
      </ViewRowCenter>
      <TextInside>0 đánh giá</TextInside>
    </View>
      {[
        { id: 5, vote: 0 },
        { id: 4, vote: 0 },
        { id: 3, vote: 0 },
        { id: 2, vote: 0 },
        { id: 1, vote: 0 },
      ].map((item, index) => {
        return (
          <ViewRowCenter key={index}>
            <ViewProgressLeft>
              <TextInside>{item.id}</TextInside>
              <MaterialCommunityIcons name="star" color="gray" size={16} />
            </ViewProgressLeft>
            <ViewProgressCenter style={{ flex: 1 }}>
              <Progress step={item.vote} steps={0} height={16} />
            </ViewProgressCenter>
            <TextInsideRight style={{ textAlign: 'right', width: 50 }}>
              0 %
        </TextInsideRight>
          </ViewRowCenter>
        );
      })}
    </>
  }

  return (
    <VoteView>
      <TitleVote>Số sao hiện tại</TitleVote>
      {numberVote ? <>
        <View style={{ alignItems: 'center', paddingTop: 30, paddingBottom: 30 }}>
          <ViewRowEnd>
            <NumberVote>{numberVote}</NumberVote>
            <TextInside>/5</TextInside>
          </ViewRowEnd>
          {_renderRating(numberVote)}
          <TextInside>{countNumberRef.current} đánh giá</TextInside>
        </View>
        {
          listVotesRef.current.map((item, index) => {
            return <ViewRowCenter key={index}>
              <ViewProgressLeft>
                <TextInside>{item.point}</TextInside>
                <MaterialCommunityIcons name="star" color="gray" size={16} />
              </ViewProgressLeft>
              <ViewProgressCenter style={{ flex: 1 }}>
                <Progress step={item.total} steps={countNumberRef.current} height={16} />
              </ViewProgressCenter>
              <TextInsideRight style={{ textAlign: 'right', width: 50 }}>
                {item.percent}%
              </TextInsideRight>
            </ViewRowCenter>
          })
        }
      </>
        : _renderEmptyData()}
    </VoteView>
  );
}

export default Votes;

const ViewRowEnd = styled.View`
  flex-direction: row;
  align-items: flex-end;
`;
const VoteView = styled.View`
  flex: 1;
  margin: 10px;
  background-color: ${colors.WHITE};
  padding: 20px;
  align-items: center;
`;
const TitleVote = styled.Text`
  color: ${colors.BLACK};
  font-size: 24px;
`;
const NumberVote = styled.Text`
  color: ${colors.BLACK};
  font-size: 40px;
  font-weight: bold;
  line-height: 50px;
`;
const TextInside = styled.Text`
  color: ${colors.BLACK};
  font-size: 14px;
  line-height: 30px;
`;
const ViewRowCenter = styled.View`
  flex-direction: row;
  align-items: center;
`;
const ViewProgressLeft = styled.View`
  flex-direction: row;
  align-items: center;
  width: 40px;
`;
const ViewProgressCenter = styled.View`
  flex: 1;
`;
const TextInsideRight = styled.Text`
  color: ${colors.BLACK};
  font-size: 14px;
  line-height: 30px;
  text-align: right;
  width: 50px;
`;
