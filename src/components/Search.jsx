import { View, Text, TextInput, StyleSheet } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const SearchFilter = () => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    console.log("Search");
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={24}
          color="#2596BE"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search"
          placeholderTextColor={"#000"}
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "70%",
    borderBottomWidth: 0.5,
    borderBottomColor: "#2596BE",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: {
    marginLeft: 10,
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 14,
    paddingHorizontal: 3,
  },
});

export default SearchFilter;
