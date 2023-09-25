import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Text,
  View,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../../atoms/authTokenState";
import { userPassword } from "../../../atoms/userPassword";
import CardData from "../../../components/CardData";
import SearchFilter from "../../../components/SearchFilter";
import Modal from "react-native-modal";
import { Card, Button, CheckBox } from "react-native-elements";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons";

const DepartmentHead = () => {
  const authToken = useRecoilValue(authTokenState);
  const userPasscode = useRecoilValue(userPassword);
  const [data, setData] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedCardData, setSelectedCardData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  // METHODS ARE DEFINED HERE
  const handleCardPress = (cardData, cardKey) => {
    setSelectedCardData({ ...cardData, ...{ cardKey, isapproved: false } });
    toggleModal();
  };

  // TOGGLE MODAL
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  // GET VENDOR NAME AND UNIT NAME
  const getVendor = (id) => {
    const vendor = vendors.find((vendor) => vendor.id == id);
    return vendor?.vendor_Name ? vendor.vendor_Name : "Select a supplier";
  };
  const getUnit = (id) => {
    const unit = units.find((unit) => unit.id == id);
    return unit.name;
  };

  // handle item approval checkbox state
  const handleItemApproval = (item) => {
    item.isapproved = !item.isapproved;
    setCheckedItems((prevState) => {
      const newState = {
        ...prevState,
        [item.item_Id]: !prevState[item.item_Id],
      };
      return newState;
    });
  };

  // Submit event handler
  const handleSubmit = async () => {
    let isapproved = false;
    await selectedCardData.purchase_request_details.map((item) => {
      if (item.isapproved == true) isapproved = true;
    });
    selectedCardData.isapproved = isapproved;
    Alert.prompt("Please enter your password:", "", (password) => {
      if (password === userPasscode) {
        try {
          axios
            .post(
              "http://10.4.15.12:8004/api/purchase-request-items",
              selectedCardData,
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              }
            )
            .then((response) => {
              console.log(response.data);
              alert("PR Approved on Selected Items");
              setModalVisible(!modalVisible);
            });
        } catch (error) {
          console.error(error);
        }
      } else {
        alert("Wrong password");
        return;
      }
    });
  };

  // FETCH DATA FROM API AND STORE IN DATA STATE
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://10.4.15.12:8004/api/purchase-request?page=1&per_page=10&tab=1",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setData(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchVendors = async () => {
      try {
        const response = await axios.get("http://10.4.15.12:8004/api/vendors", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setVendors(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchUnits = async () => {
      try {
        const response = await axios.get("http://10.4.15.12:8004/api/units", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setUnits(response.data.units);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVendors();
    fetchUnits();
    fetchData();
  }, [authToken]);

  return (
    <View style={{ paddingBottom: 185 }}>
      <SearchFilter />
      <ScrollView>
        {Object.keys(data).map((key) => (
          <TouchableOpacity
            key={key}
            onPress={() => handleCardPress(data[key], key)}
          >
            <CardData
              prId={data[key].code}
              transactionDate={data[key].pr_Transaction_Date}
              requestingName={data[key].user.name}
              warehouse={data[key].warehouse.warehouse_description}
              itemGroup={data[key].item_group.name}
              category={data[key].category.name}
              justification={data[key].pr_Justication}
              cardKey={key}
            />
          </TouchableOpacity>
        ))}
        <Modal isVisible={modalVisible} style={styles.modalContainer}>
          <ScrollView horizontal={true}>
            {selectedCardData?.purchase_request_details?.map((item, index) => (
              <Card key={index} containerStyle={styles.cardContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputText}>Item Code </Text>
                  <TextInput
                    style={styles.dataInput}
                    editable={false}
                    value={item.item_Id}
                  ></TextInput>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputText}>Item Name </Text>
                  <TextInput
                    style={styles.dataInput}
                    editable={false}
                    value={item.item_master?.item_name}
                  ></TextInput>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputText}>Preferred Supplier</Text>
                  <RNPickerSelect
                    value={item.prepared_supplier_id}
                    onValueChange={(value) => {
                      const updatedData = { ...selectedCardData };
                      updatedData.purchase_request_details[
                        index
                      ].prepared_supplier_id = value;
                      setSelectedCardData(updatedData);
                    }}
                    items={vendors.map((vendor) => ({
                      label: vendor.vendor_Name,
                      value: vendor.id,
                    }))}
                    placeholder={{
                      label: getVendor(item.prepared_supplier_id),
                      value: item.prepared_supplier_id,
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
                      return (
                        <Ionicons name="chevron-down" size={18} color="gray" />
                      );
                    }}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputText}>Requested Quantity </Text>
                  <TextInput
                    style={styles.dataInput}
                    editable={false}
                    value={item?.item_Request_Qty}
                  ></TextInput>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputText}>
                    Requested Unit of Measurement{" "}
                  </Text>
                  <TextInput
                    style={styles.dataInput}
                    editable={false}
                    value={getUnit(item.item_Request_UnitofMeasurement_Id)}
                  ></TextInput>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputText}>Approved Quantity </Text>
                  <TextInput
                    keyboardType="numeric"
                    placeholder="......"
                    placeholderTextColor={"gray"}
                    style={styles.dataInput}
                    value={
                      item?.item_Request_Department_Approved_Qty !== null
                        ? item.item_Request_Department_Approved_Qty.toString()
                        : ""
                    }
                    onChangeText={(text) => {
                      const updatedData = { ...selectedCardData };
                      updatedData.purchase_request_details[
                        index
                      ].item_Request_Department_Approved_Qty = text;
                      setSelectedCardData(updatedData);
                    }}
                  ></TextInput>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputText}>
                    Approved Unit of Measurement
                  </Text>
                  <RNPickerSelect
                    value={
                      item?.item_Request_Department_Approved_UnitofMeasurement_Id
                    }
                    onValueChange={(value) => {
                      const updatedData = { ...selectedCardData };
                      updatedData.purchase_request_details[
                        index
                      ].item_Request_Department_Approved_UnitofMeasurement_Id =
                        value;
                      setSelectedCardData(updatedData);
                    }}
                    items={units.map((unit) => ({
                      label: unit.name,
                      value: unit.id,
                    }))}
                    placeholder={{
                      label: getUnit(item.item_Request_UnitofMeasurement_Id),
                      value: item.item_Request_UnitofMeasurement_Id,
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
                      return (
                        <Ionicons name="chevron-down" size={18} color="gray" />
                      );
                    }}
                  />
                </View>
                <CheckBox
                  title={"Approve Request"}
                  checked={checkedItems[item.item_Id]}
                  onPress={() => handleItemApproval(item)}
                />
              </Card>
            ))}
          </ScrollView>
          <Button
            title={"Submit"}
            buttonStyle={{
              backgroundColor: "orange",
              paddingHorizontal: 25,
              margin: 10,
              borderRadius: 15,
            }}
            onPress={handleSubmit}
          />
          <Button
            title={"Back"}
            buttonStyle={{
              backgroundColor: "#2596BE",
              paddingHorizontal: 25,
              margin: 10,
              borderRadius: 15,
            }}
            onPress={toggleModal}
          />
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    marginTop: 50,
    marginBottom: 35,
  },
  cardContainer: {
    borderRadius: 10,
    borderColor: "#66B5D1",
  },
  inputContainer: {
    paddingHorizontal: 10,
    paddingVertical: 13,
  },
  inputText: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 3,
  },
  dataInput: {
    fontSize: 18,
  },
});

export default DepartmentHead;
