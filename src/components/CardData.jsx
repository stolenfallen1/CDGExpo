import { View, Text, TouchableOpacity } from "react-native";
import { Card } from "react-native-elements";
import React, { useState } from "react";

const CardData = () => {
  const handlePress = () => {
    console.log("Pressed");
  };

  return (
    <TouchableOpacity>
      <Card>
        <View>
          <Text>PR No.: 12345678</Text>
          <Text>Date Request: 01/01/2022</Text>
          <Text>Requesting: John Doe</Text>
          <Text>Item group: Group A</Text>
          <Text>Category: Category A</Text>
          <Text>PR Status: Approved</Text>
          <Text>Date approved: 01/02/2022</Text>
          <Text>Remarks: N/A</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default CardData;
