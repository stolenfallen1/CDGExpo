import { View, Text, TouchableOpacity } from "react-native";
import { Card } from "react-native-elements";
import React, { useState } from "react";

const CardData = ({
  prId,
  transactionDate,
  requestingName,
  itemGroup,
  category,
  justification,
}) => {
  const handlePress = () => {
    console.log("Pressed");
  };

  return (
    <TouchableOpacity>
      <Card>
        <Text>PR No: {prId} </Text>
        <Text>Date Request: {transactionDate} </Text>
        <Text>Requesting: {requestingName} </Text>
        <Text>Item group: {itemGroup} </Text>
        <Text>Category: {category} </Text>
        <Text>PR Status: For Approval </Text>
        <Text>Date approved: Need to add condition</Text>
        <Text>Remarks: {justification} </Text>
      </Card>
    </TouchableOpacity>
  );
};

export default CardData;
