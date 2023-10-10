import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import FilterOptions from "./FilterOptions";
import CardData from "../../../components/CardData";

const CorporateAdminDash = () => {
  return (
    <View>
      <FilterOptions />
      <CardData />
    </View>
  );
};

export default CorporateAdminDash;
