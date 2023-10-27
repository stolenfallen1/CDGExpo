import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { Calendar } from "react-native-calendars";
import { useState, useEffect } from "react";
import Modal from "react-native-modal";
import { Button } from "react-native-elements";
import { customStyles } from "../../../styles/customStyles";
import { authTokenState } from "../../../atoms/authTokenState";
import { useRecoilValue } from "recoil";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const apiKey = process.env.EXPO_PUBLIC_API_URL;
const FilterOptions = ({ selectedBranchID, onClose }) => {
  // Auth token
  const authToken = useRecoilValue(authTokenState);
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
          `${apiKey}/departments?branch_id=${selectedBranchID}`,
          config
        ),
        axios.get(`${apiKey}/items-group`, config),
      ]);
      setDepartments(departments.data);
      setItemGroups(itemGroups.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, [authToken, selectedBranchID]);

  // Department Filter
  const handleSelectDepartment = (selectedDepartment) => {
    setSelectedDepartment(selectedDepartment.id);
    onClose({
      department: selectedDepartment.id,
      item_group: selectedItemGroup,
    });
  };
  // Item group Filter
  const handleSelectItemGroup = (selectedItemGroup) => {
    setSelectedItemGroup(selectedItemGroup.id);
    onClose({
      department: selectedDepartment,
      item_group: selectedItemGroup.id,
    });
  };

  return (
    <View style={styles.filterContainer}>
      <ScrollView horizontal={true}>
        {Object.keys(departments).map((option, index) => (
          <View key={index}>
            <SelectDropdown
              key={option.id}
              data={departments?.departments.map((dept) => ({
                id: dept.id,
                name: dept.warehouse_description,
              }))}
              onSelect={handleSelectDepartment}
              defaultButtonText={"Department"}
              buttonTextAfterSelection={(selectedDepartment) =>
                selectedDepartment.name
              }
              rowTextForSelection={(item) => item.name}
              renderDropdownIcon={() => {
                return (
                  <Ionicons name="chevron-down" size={18} color="#2596BE" />
                );
              }}
              buttonStyle={customStyles.buttonStyle}
              buttonTextStyle={customStyles.buttonTextStyle}
            />
          </View>
        ))}
        {Object.keys(itemGroups).map((option, index) => (
          <View key={index}>
            <SelectDropdown
              key={option.id}
              data={itemGroups?.item_groups.map((item_group) => ({
                id: item_group.id,
                name: item_group.name,
              }))}
              onSelect={handleSelectItemGroup}
              defaultButtonText={"Item Group"}
              buttonTextAfterSelection={(selectedItemGroup) =>
                selectedItemGroup.name
              }
              rowTextForSelection={(item) => item.name}
              renderDropdownIcon={() => {
                return (
                  <Ionicons name="chevron-down" size={18} color="#2596BE" />
                );
              }}
              buttonStyle={customStyles.buttonStyle}
              buttonTextStyle={customStyles.buttonTextStyle}
            />
          </View>
        ))}
        <TouchableOpacity
          onPress={calendarModal}
          style={customStyles.calendarButton}
        >
          <Text style={customStyles.calendarText}>Start Date</Text>
          <Ionicons name="calendar-outline" size={18} color="#2596BE" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={calendarModal}
          style={customStyles.calendarButton}
        >
          <Text style={customStyles.calendarText}>End Date</Text>
          <Ionicons name="calendar-outline" size={18} color="#2596BE" />
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
    paddingHorizontal: 15,
    marginTop: 30,
  },
});

export default FilterOptions;
