import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../atoms/authTokenState";
import axios from "axios";
import Search from "../../components/Search";
import PRCard from "../../components/Cards/PRCard";
import { customStyles } from "../../styles/customStyles";
import { Ionicons } from "@expo/vector-icons";
import ModalFilter from "../../components/ModalFilter";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

const CanvasHitory = () => {
  // Auth states
  const authToken = useRecoilValue(authTokenState);
  // Data states
  const [data, setData] = useState([]);
  // Modal states
  const [filterModal, setFilterModal] = useState(false);
  // Filter states
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItemGroup, setSelectedItemGroup] = useState("");
  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  const toggleFilter = () => {
    setFilterModal(true);
  };

  const handleFilterApply = ({ branch, department, category, item_group }) => {
    setSelectedBranch(branch);
    setSelectedDepartment(department);
    setSelectedCategory(category);
    setSelectedItemGroup(item_group);
    setFilterModal(false);
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiKey}/purchase-request?page=1&per_page=10&tab=7&branch=${selectedBranch}&department=${selectedDepartment}&category=${selectedCategory}&item_group=${selectedItemGroup}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setData(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [
    authToken,
    selectedBranch,
    selectedDepartment,
    selectedCategory,
    selectedItemGroup,
  ]);

  const renderItem = ({ item }) => {
    return (
      // To Continue since no data to test to
      <TouchableOpacity>
        <PRCard />
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <Text>TEST</Text>
    </View>
  );
};

export default CanvasHitory;
