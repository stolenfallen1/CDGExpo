import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";

const SearchFilter = () => {
  const [searchText, setSearchText] = useState("");
  const [filterText, setFilterText] = useState("");

  const handleSearch = () => {
    console.log("Search");
  };

  const handleFilter = () => {
    console.log("Filter");
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search"
        style={styles.searchInput}
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={handleSearch}
      />
      <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
        <Ionicons name="md-filter" size={16} color="#000" />
        <Text style={styles.filterText}>&nbsp;Filter</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    borderWidth: 0.5,
    borderRadius: 5,
  },
  filterButton: {
    flexDirection: "row",
    backgroundColor: "#50C878",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  filterText: {
    fontSize: 17,
  },
});

export default SearchFilter;
