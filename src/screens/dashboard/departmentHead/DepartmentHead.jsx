import { View, Text } from "react-native";
import React from "react";
import CardData from "../../../components/CardData";
import SearchFilter from "../../../components/SearchFilter";

const DepartmentHead = () => {
  return (
    <View>
      <SearchFilter />
      <CardData />
    </View>
  );
};

export default DepartmentHead;
