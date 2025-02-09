import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import SelectDropdown from "react-native-select-dropdown";
import Modal from "react-native-modal";
import { Calendar } from "react-native-calendars";
import axios from "axios";
import { customStyles } from "../styles/customStyles";
import { Button } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { authTokenState } from "../atoms/authTokenState";
import { userBranchID } from "../atoms/userBranchId";
import { userRoleState } from "../atoms/userRoleState";
import { useRecoilValue } from "recoil";

const apiKey = process.env.EXPO_PUBLIC_API_URL;
const ModalFilter = ({ onSubmit, handleClose }) => {
  // Auth Token
  const authToken = useRecoilValue(authTokenState);
  const branchID = useRecoilValue(userBranchID);
  const userRole = useRecoilValue(userRoleState);
  // Filter Options state
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [itemGroups, setItemGroups] = useState([]);
  // Selected Filter Options state
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItemGroup, setSelectedItemGroup] = useState("");
  // Calendar modal state
  const [startDateModal, setStartDateModal] = useState(false);
  const [endDateModal, setEndDateModal] = useState(false);
  // Selected date state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const startDateCalendar = () => {
    setStartDateModal(true);
  };

  const endDateCalendar = () => {
    setEndDateModal(true);
  };

  const handleApplyButtonPress = () => {
    onSubmit({
      branch: selectedBranch,
      department: selectedDepartment,
      category: selectedCategory,
      item_group: selectedItemGroup,
      start_date: startDate,
      end_date: endDate,
    });
  };

  const fetchFilterOptions = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
      const [branches, departments, categories, itemGroups] = await Promise.all(
        [
          axios.get(`${apiKey}/branches`, config),
          axios.get(`${apiKey}/departments?branch_id=${branchID}`, config),
          axios.get(`${apiKey}/categories`, config),
          axios.get(`${apiKey}/items-group`, config),
        ]
      );
      setBranches(branches.data);
      setDepartments(departments.data);
      setCategories(categories.data);
      setItemGroups(itemGroups.data);
    } catch (error) {
      if (error.response.status === 401) {
        navigation.navigate("Login");
        alert("Session expired or another user has logged in.");
      } else {
        alert("Something went wrong. Please try again.", error.response.status);
      }
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, [authToken, branchID]);

  return (
    <>
      <View style={styles.modalContainer}>
        {/* Branch Dropdown */}
        {userRole === "administrator" ||
        userRole === "comptroller" ||
        userRole === "consultant"
          ? Object.keys(branches).map((option, index) => (
              <View key={index} style={{ paddingVertical: 5 }}>
                <Text style={customStyles.inputText}>Branch:</Text>
                <SelectDropdown
                  key={option?.id}
                  data={branches?.branches.map((branch) => ({
                    id: branch.id,
                    name: branch.abbreviation,
                  }))}
                  onSelect={(selectedBranch) =>
                    setSelectedBranch(selectedBranch.id)
                  }
                  defaultButtonText={"Select Branch"}
                  buttonTextAfterSelection={(selectedBranch) =>
                    selectedBranch.name
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
            ))
          : null}
        {/* Department Dropdown */}
        {userRole === "administrator" ||
        userRole === "comptroller" ||
        userRole === "consultant"
          ? Object.keys(departments).map((option, index) => (
              <View key={index} style={{ paddingVertical: 5 }}>
                <Text style={customStyles.inputText}>Department:</Text>
                <SelectDropdown
                  key={option?.id}
                  data={departments?.departments.map((dept) => ({
                    id: dept.id,
                    name: dept.warehouse_description,
                  }))}
                  onSelect={(selectedDepartment) =>
                    setSelectedDepartment(selectedDepartment.id)
                  }
                  defaultButtonText={"Select Department"}
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
            ))
          : null}
        {/* Item Group Dropdown */}
        {Object.keys(itemGroups).map((option, index) => (
          <View key={index} style={{ paddingVertical: 5 }}>
            <Text style={customStyles.inputText}>Item Group:</Text>
            <SelectDropdown
              key={option?.id}
              data={itemGroups?.item_groups.map((item_group) => ({
                id: item_group.id,
                name: item_group.name,
              }))}
              onSelect={(selectedItemGroup) =>
                setSelectedItemGroup(selectedItemGroup.id)
              }
              defaultButtonText={"Select Item Group"}
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
        {/* Category Dropdown */}
        {Object.keys(categories).map((option, index) => (
          <View key={index} style={{ paddingVertical: 5 }}>
            <Text style={customStyles.inputText}>Categories:</Text>
            <SelectDropdown
              key={option?.id}
              data={categories?.categories.map((category) => ({
                id: category.id,
                name: category.name,
              }))}
              onSelect={(selectedCategory) =>
                setSelectedCategory(selectedCategory.id)
              }
              defaultButtonText={"Select Category"}
              buttonTextAfterSelection={(selectedCategory) =>
                selectedCategory.name
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={startDateCalendar}
            style={styles.calendarButton}
          >
            <Text>
              {startDate === "" ? "Start Date" : startDate} {""}
              <Ionicons name="calendar-outline" size={15} color={"#2596BE"} />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={endDateCalendar}
            style={styles.calendarButton}
          >
            <Text>
              {endDate === "" ? "End Date" : endDate} {""}
              <Ionicons name="calendar-outline" size={15} color={"#2596BE"} />
            </Text>
          </TouchableOpacity>
        </View>
        {/* Start Date Calendar Modal */}
        <Modal isVisible={startDateModal}>
          <Calendar
            style={{ borderRadius: 10 }}
            onDayPress={(day) => {
              setStartDate(day.dateString);
            }}
            markedDates={{
              [startDate]: {
                selected: true,
                disableTouchEvent: true,
                selectedDotColor: "orange",
              },
            }}
          />
          <Button
            title={"Back"}
            buttonStyle={customStyles.cancelButton}
            onPress={() => setStartDateModal(false)}
          />
        </Modal>
        {/* End Date Calendar Modal */}
        <Modal isVisible={endDateModal}>
          <Calendar
            style={{ borderRadius: 10 }}
            onDayPress={(day) => {
              setEndDate(day.dateString);
            }}
            markedDates={{
              [endDate]: {
                selected: true,
                disableTouchEvent: true,
                selectedDotColor: "orange",
              },
            }}
          />
          <Button
            title={"Back"}
            buttonStyle={customStyles.cancelButton}
            onPress={() => setEndDateModal(false)}
          />
        </Modal>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={"Filter"}
          buttonStyle={customStyles.submitButton}
          onPress={handleApplyButtonPress}
        />
        <Button
          title={"Back"}
          buttonStyle={customStyles.cancelButton}
          onPress={handleClose}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  calendarButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 22,
    borderWidth: 0.5,
  },
});

export default ModalFilter;
