import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { Button } from "react-native-elements";
import { authTokenState } from "../atoms/authTokenState";
import { useRecoilValue } from "recoil";

const ModalFilter = ({ onSubmit, handleClose }) => {
  const authToken = useRecoilValue(authTokenState);
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [itemGroups, setItemGroups] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItemGroup, setSelectedItemGroup] = useState("");

  const handleApplyButtonPress = () => {
    onSubmit({
      branch: selectedBranch,
      department: selectedDepartment,
      category: selectedCategory,
      item_group: selectedItemGroup,
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
          axios.get(`http://10.4.15.12:8004/api/branches`, config),
          axios.get(`http://10.4.15.12:8004/api/departments`, config),
          axios.get(`http://10.4.15.12:8004/api/categories`, config),
          axios.get(`http://10.4.15.12:8004/api/items-group`, config),
        ]
      );
      setBranches(branches.data);
      setDepartments(departments.data);
      setCategories(categories.data);
      setItemGroups(itemGroups.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, [authToken]);

  return (
    <View style={styles.modalContainer}>
      {/* Branch Dropdown */}
      {Object.keys(branches).map((option, index) => (
        <View key={index} style={{ paddingVertical: 15 }}>
          <Text style={styles.inputText}>Branch:</Text>
          <RNPickerSelect
            key={option?.id}
            value={option?.id}
            items={branches?.branches.map((branch) => ({
              label: branch?.abbreviation,
              value: branch?.id,
            }))}
            onValueChange={setSelectedBranch}
            placeholder={{
              label: "Select Branch",
              value: "",
            }}
            style={{
              inputIOS: {
                fontSize: 16,
                borderBottomWidth: 0.5,
                paddingBottom: 6,
              },
              inputAndroid: {
                fontSize: 16,
                borderBottomWidth: 0.5,
                paddingBottom: 6,
              },
            }}
            Icon={() => {
              return <Ionicons name="chevron-down" size={18} color="gray" />;
            }}
          />
        </View>
      ))}
      {/* Department Dropdown */}
      {Object.keys(departments).map((option, index) => (
        <View key={index} style={{ paddingVertical: 15 }}>
          <Text style={styles.inputText}>Department:</Text>
          <RNPickerSelect
            key={option?.id}
            value={option?.id}
            items={departments?.departments.map((dept) => ({
              label: dept?.warehouse_description,
              value: dept?.id,
            }))}
            onValueChange={setSelectedDepartment}
            placeholder={{
              label: "Select Department",
              value: "",
            }}
            style={{
              inputIOS: {
                fontSize: 16,
                borderBottomWidth: 0.5,
                paddingBottom: 6,
              },
              inputAndroid: {
                fontSize: 16,
                borderBottomWidth: 0.5,
                paddingBottom: 6,
              },
            }}
            Icon={() => {
              return <Ionicons name="chevron-down" size={18} color="gray" />;
            }}
          />
        </View>
      ))}
      {/* Category Dropdown */}
      {Object.keys(categories).map((option, index) => (
        <View key={index} style={{ paddingVertical: 15 }}>
          <Text style={styles.inputText}>Categories:</Text>
          <RNPickerSelect
            key={option?.id}
            value={option?.id}
            items={categories?.categories.map((category) => ({
              label: category?.name,
              value: category?.id,
            }))}
            onValueChange={setSelectedCategory}
            placeholder={{
              label: "Select Category",
              value: "",
            }}
            style={{
              inputIOS: {
                fontSize: 16,
                borderBottomWidth: 0.5,
                paddingBottom: 6,
              },
              inputAndroid: {
                fontSize: 16,
                borderBottomWidth: 0.5,
                paddingBottom: 6,
              },
            }}
            Icon={() => {
              return <Ionicons name="chevron-down" size={18} color="gray" />;
            }}
          />
        </View>
      ))}
      {/* Category Dropdown */}
      {Object.keys(itemGroups).map((option, index) => (
        <View key={index} style={{ paddingVertical: 15 }}>
          <Text style={styles.inputText}>Categories:</Text>
          <RNPickerSelect
            key={option?.id}
            value={option?.id}
            items={itemGroups?.item_groups.map((item_group) => ({
              label: item_group?.name,
              value: item_group?.id,
            }))}
            onValueChange={setSelectedItemGroup}
            placeholder={{
              label: "Select Item Group",
              value: "",
            }}
            style={{
              inputIOS: {
                fontSize: 16,
                borderBottomWidth: 0.5,
                paddingBottom: 6,
              },
              inputAndroid: {
                fontSize: 16,
                borderBottomWidth: 0.5,
                paddingBottom: 6,
              },
            }}
            Icon={() => {
              return <Ionicons name="chevron-down" size={18} color="gray" />;
            }}
          />
        </View>
      ))}
      <Button
        title={"Filter"}
        buttonStyle={{
          marginTop: 30,
          backgroundColor: "orange",
          paddingHorizontal: 20,
          margin: 7,
          borderRadius: 10,
        }}
        onPress={handleApplyButtonPress}
      />
      <Button
        title={"Back"}
        buttonStyle={{
          backgroundColor: "#2596BE",
          paddingHorizontal: 20,
          margin: 7,
          borderRadius: 10,
        }}
        onPress={handleClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  inputText: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 2,
  },
});

export default ModalFilter;
