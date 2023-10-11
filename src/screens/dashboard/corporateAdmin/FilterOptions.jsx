import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Calendar } from "react-native-calendars";
import React, { useState, useEffect } from "react";
import Modal from "react-native-modal";
import { Button } from "react-native-elements";
import { customStyles } from "../../../styles/customStyles";
import { authTokenState } from "../../../atoms/authTokenState";
import { userBranchID } from "../../../atoms/userBranchId";
import { useRecoilValue } from "recoil";
import axios from "axios";

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
  // Auth token
  const authToken = useRecoilValue(authTokenState);
  const branchID = useRecoilValue(userBranchID);
  // Filter options state
  const [departments, setDepartments] = useState([]);
  const [itemGroups, setItemGroups] = useState([]);
  // Selected Filter Options state
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedItemGroup, setSelectedItemGroup] = useState("");
  // Selected date state
  const [selected, setSelected] = useState("");
  // Calendar modal state
  const [modalVisible, setModalVisible] = useState(false);

  const calendarModal = () => {
    setModalVisible(true);
  };

  const fetchFilterOptions = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
      const [departments, itemGroups] = await Promise.all([
        axios.get(
          `http://10.4.15.12:8004/api/departments?branch_id=${branchID}`,
          config
        ),
        axios.get(`http://10.4.15.12:8004/api/items-group`, config),
      ]);
      setDepartments(departments.data);
      setItemGroups(itemGroups.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, [authToken, branchID]);

  return (
    <View style={styles.filterContainer}>
      <ScrollView horizontal={true}>
        {Object.keys(departments).map((option, index) => (
          <RNPickerSelect
            key={index}
            value={option?.id}
            placeholder={{ label: "Department", value: "" }}
            items={departments?.departments.map((dept) => ({
              label: dept?.warehouse_description,
              value: dept?.id,
            }))}
            onValueChange={setSelectedDepartment}
            style={DROPDOWN_STYLES}
          />
        ))}
        {Object.keys(itemGroups).map((option, index) => (
          <RNPickerSelect
            key={index}
            value={option?.id}
            placeholder={{ label: "Inventory Group", value: "" }}
            onValueChange={setSelectedItemGroup}
            items={itemGroups?.item_groups.map((item_group) => ({
              label: item_group?.name,
              value: item_group?.id,
            }))}
            style={DROPDOWN_STYLES}
          />
        ))}
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
          buttonStyle={customStyles.cancelButton}
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
