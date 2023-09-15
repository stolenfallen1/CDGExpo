import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Text,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../../atoms/authTokenState";
import CardData from "../../../components/CardData";
import SearchFilter from "../../../components/SearchFilter";
import Modal from "react-native-modal";
import { Card, Button } from "react-native-elements";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons";

const DepartmentHead = () => {
  const authToken = useRecoilValue(authTokenState);
  const [data, setData] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedCardData, setSelectedCardData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [buttonText, setButtonText] = useState("Approve");
  const [buttonColor, setButtonColor] = useState("#50C878");

  const handleCardPress = (cardData, cardKey) => {
    setSelectedCardData({ ...cardData, cardKey });
    toggleModal();
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  // Use spread operator to copy the object and change the value of isApproved
  const handleApprove = (item) => {
    item.isApproved = !item.isApproved;
    console.log(item.isApproved);
    // setIsApproved(!isApproved);
    // setButtonText(isApproved ? "Approve" : "Cancel");
    // setButtonColor(isApproved ? "#50C878" : "red");
  };

  const getVendor = (id) => {
    const vendor = vendors.find((vendor) => vendor.id == id);
    return vendor.vendor_Name;
  };
  const getUnit = (id) => {
    const unit = units.find((unit) => unit.id == id);
    return unit.name;
  };

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
    <ScrollView>
      <SearchFilter />
      {Object.keys(data).map((key) => (
        <TouchableOpacity
          key={key}
          onPress={() => handleCardPress(data[key], key)}
        >
          <CardData
            prId={data[key].code}
            transactionDate={data[key].pr_Transaction_Date}
            requestingName={data[key].user.name}
            itemGroup={data[key].item_group.name}
            category={data[key].category.name}
            quantity={data[key].purchase_request_details[key].item_Request_Qty}
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
                <TextInput style={styles.dataInput} editable={false}>
                  {item.item_Id}
                </TextInput>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputText}>Item Name </Text>
                <TextInput style={styles.dataInput} editable={false}>
                  {item.item_master?.item_name}
                </TextInput>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputText}>Preferred Supplier</Text>
                <RNPickerSelect
                  value={item.prepared_supplier_id}
                  onValueChange={(value) => {
                    // Handle the event change here
                  }}
                  items={vendors.map((vendor) => ({
                    label: vendor.vendor_Name,
                    value: vendor.id,
                  }))}
                  placeholder={{
                    label: getVendor(item.prepared_supplier_id),
                    value: item.prepared_supplier_id,
                  }}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputText}>Requested Quantity </Text>
                <TextInput style={styles.dataInput} editable={false}>
                  {parseInt(item?.item_Request_Qty)}
                </TextInput>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputText}>
                  Requested Unit of Measurement
                </Text>
                <RNPickerSelect
                  disabled={true}
                  value={item.prepared_supplier_id}
                  onValueChange={(value) => {
                    // Handle the event change here
                  }}
                  items={units.map((unit) => ({
                    label: unit.name,
                    value: unit.id,
                  }))}
                  placeholder={{
                    label: getUnit(item.item_Request_UnitofMeasurement_Id),
                    value: item.item_Request_UnitofMeasurement_Id,
                  }}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputText}>Approved Quantity </Text>
                <TextInput
                  style={styles.dataInput}
                  // {item?.item_Request_Department_Approved_Qty}
                >
                  {parseInt(item?.item_Request_Qty)}
                </TextInput>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputText}>
                  Approved Unit of Measurement
                </Text>
                <RNPickerSelect
                  // {item?.item_Request_Department_Approved_UnitofMeasurement_Id}
                  value={item.prepared_supplier_id}
                  onValueChange={(value) => {
                    // Handle the event change here
                  }}
                  items={units.map((unit) => ({
                    label: unit.name,
                    value: unit.id,
                  }))}
                  placeholder={{
                    label: getUnit(item.item_Request_UnitofMeasurement_Id),
                    value: item.item_Request_UnitofMeasurement_Id,
                  }}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputText}>Attachments</Text>
                <Ionicons name="eye" size={20} color="#000" />
              </View>
              <Button
                key={item.item_Id}
                onPress={handleApprove}
                title={item.isApproved ? "Cancel" : "Approve"}
                buttonStyle={{
                  backgroundColor: buttonColor,
                  paddingHorizontal: 25,
                  borderRadius: 15,
                }}
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
          onPress={toggleModal}
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
