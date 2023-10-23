import { View, Text } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";

const apiKey = process.env.EXPO_PUBLIC_API_URL;
// http://10.4.15.12:8004/api/purchase-request/3654?tab=7

const ApprovedCanvas = () => {
  const route = useRoute();
  const { pr_id } = route.params;
  console.log(pr_id);

  return (
    <View>
      <Text>{pr_id}</Text>
    </View>
  );
};

export default ApprovedCanvas;
