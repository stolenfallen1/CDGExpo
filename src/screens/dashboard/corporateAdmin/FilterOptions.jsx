import { View, Text, ScrollView, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import React from "react";

const INPUT_ANDROID_STYLES = {
  fontSize: 17,
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 4,
  marginRight: 22,
  borderColor: "#2596BE",
  borderWidth: 1,
};

const DROPDOWN_STYLES = {
  inputAndroid: INPUT_ANDROID_STYLES,
  inputIOS: {
    ...INPUT_ANDROID_STYLES,
  },
};

const FilterOptions = () => {
  return (
    <View style={styles.filterContainer}>
      <ScrollView horizontal={true}>
        <RNPickerSelect
          placeholder={{ label: "Department", value: "" }}
          onValueChange={(value) => console.log(value)}
          items={[
            { label: "Football", value: "football" },
            { label: "Baseball", value: "baseball" },
            { label: "Hockey", value: "hockey" },
          ]}
          style={DROPDOWN_STYLES}
        />
        <RNPickerSelect
          placeholder={{ label: "Inventory Group", value: "" }}
          onValueChange={(value) => console.log(value)}
          items={[
            { label: "Football", value: "football" },
            { label: "Baseball", value: "baseball" },
            { label: "Hockey", value: "hockey" },
          ]}
          style={DROPDOWN_STYLES}
        />
        <RNPickerSelect
          placeholder={{ label: "Transaction start date", value: "" }}
          onValueChange={(value) => console.log(value)}
          items={[
            { label: "Football", value: "football" },
            { label: "Baseball", value: "baseball" },
            { label: "Hockey", value: "hockey" },
          ]}
          style={DROPDOWN_STYLES}
        />
        <RNPickerSelect
          placeholder={{ label: "Transaction end date", value: "" }}
          onValueChange={(value) => console.log(value)}
          items={[
            { label: "Football", value: "football" },
            { label: "Baseball", value: "baseball" },
            { label: "Hockey", value: "hockey" },
          ]}
          style={DROPDOWN_STYLES}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
});

export default FilterOptions;
