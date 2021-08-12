import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {colors} from '../../assets';
import BottomSheet from '../BottomSheet';
import ButtonComponent from '../ButtonComponent';
import NoteComponent from '../NoteComponent';
import TextComponent from '../TextComponent';

const BottomSheetNote = ({setRef, item, onConfirm}) => {
  const {item_name, note} = item || {};
  const [valueNote, setValueNote] = useState('');

  const _onChangeText = (text) => setValueNote(text);

  useEffect(() => {
    setValueNote(note);
  }, [JSON.stringify(item)]);

  return (
    <BottomSheet setRef={setRef}>
      <Container>
        <TextComponent center heavy medium mBottom={15}>
          {item_name}
        </TextComponent>

        <NoteComponent
          height={120}
          value={valueNote}
          onChangeText={_onChangeText}
        />

        <FootWrapper>
          <ButtonComponent
            onPress={() => onConfirm(valueNote)}
            title="Lưu"
            titleColor={colors.ORANGE}
            iconName="save"
            iconColor={colors.ORANGE}
            borColor={colors.ORANGE}
            paddingV={5}
            paddingH={10}
            borRadius={5}
            rowItem
          />
        </FootWrapper>
      </Container>
    </BottomSheet>
  );
};

BottomSheetNote.prototype = {
  setRef: PropTypes.shape({current: PropTypes.any}),
  item: PropTypes.object,
  onConfirm: PropTypes.func,
};

export default BottomSheetNote;

const Container = styled.View`
  flex: 1;
  padding: 10px;
`;

const FootWrapper = styled.View`
  justify-content: flex-end;
  flex-direction: row;
  margin-top: 15px;
`;
