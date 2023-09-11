import { View, Text, TouchableOpacity } from "react-native";
import { Card } from "react-native-elements";
import React, { useState } from "react";

const CardData = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePress = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Card>
        <View>
          <Text>PR No.: 12345</Text>
          <Text>Date Request: 01/01/2022</Text>
          <Text>Requesting: John Doe</Text>
          <Text>Item group: Group A</Text>
          <Text>Category: Category A</Text>
          <Text>PR Status: Approved</Text>
          <Text>Date approved: 01/02/2022</Text>
          <Text>Remarks: N/A</Text>
          {isExpanded && (
            <View>
              <Text>Additional information</Text>
              {/* ADD ADDITIONAL INFORMATION HERE */}
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default CardData;
