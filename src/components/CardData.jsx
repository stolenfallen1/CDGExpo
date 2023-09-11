import { View, Text, TouchableOpacity } from "react-native";
import { Card } from "react-native-elements";
import React, { useState } from "react";

const CardData = ({
  prNo,
  dateRequest,
  requesting,
  itemGroup,
  category,
  prStatus,
  dateApproved,
  remarks,
}) => {
  const handlePress = () => {
    console.log("Pressed");
  };

  return (
    <TouchableOpacity>
      <Card>
        <View>
          <Text>PR No.: {prNo}</Text>
          <Text>Date Request: {dateRequest}</Text>
          <Text>Requesting: {requesting}</Text>
          <Text>Item group: {itemGroup}</Text>
          <Text>Category: {category}</Text>
          <Text>PR Status: {prStatus}</Text>
          <Text>Date approved: {dateApproved}</Text>
          <Text>Remarks: {remarks}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default CardData;
