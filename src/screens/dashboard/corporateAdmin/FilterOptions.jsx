import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Calendar } from "react-native-calendars";
import React, { useState } from "react";
import Modal from "react-native-modal";
import { Button } from "react-native-elements";

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
  const [selected, setSelected] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const calendarModal = () => {
    setModalVisible(true);
  };

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
        <TouchableOpacity onPress={calendarModal} style={styles.calendarButton}>
          <Text style={styles.calendarText}>Transaction Start Date</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={calendarModal} style={styles.calendarButton}>
          <Text style={styles.calendarText}>Transaction End Date</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal isVisible={modalVisible}>
        <Calendar
          style={{ borderRadius: 10 }}
          onDayPress={(day) => {
            setSelected(day.dateString);
          }}
          markedDates={{
            [selected]: {
              selected: true,
              disableTouchEvent: true,
              selectedDotColor: "orange",
            },
          }}
        />
        <Button
          title={"Back"}
          buttonStyle={{
            backgroundColor: "#2596BE",
            paddingHorizontal: 20,
            margin: 7,
            borderRadius: 10,
          }}
          onPress={() => setModalVisible(false)}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  calendarButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 22,
    borderColor: "#2596BE",
    borderWidth: 1,
  },
  calendarText: {
    fontSize: 17,
    color: "lightgray",
  },
});

export default FilterOptions;
