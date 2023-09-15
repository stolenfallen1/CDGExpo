import {
  ScrollView,
  TouchableOpacity,
  Button,
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
import { Card } from "react-native-elements";
import RNPickerSelect from "react-native-picker-select";

const DepartmentHead = () => {
  const authToken = useRecoilValue(authTokenState);
  const [data, setData] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedCardData, setSelectedCardData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const handleCardPress = (cardData, cardKey) => {
    setSelectedCardData({ ...cardData, cardKey });
    toggleModal();
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
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
        <ScrollView>
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
              <Button title="Approve" />
            </Card>
          ))}
        </ScrollView>
        <Button title="Back" onPress={toggleModal} />
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
    paddingVertical: 5,
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
