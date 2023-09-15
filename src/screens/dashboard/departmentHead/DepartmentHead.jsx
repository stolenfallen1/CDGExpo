import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  Button,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../../atoms/authTokenState";
import CardData from "../../../components/CardData";
import SearchFilter from "../../../components/SearchFilter";
import Modal from "react-native-modal";
import { Card, Input } from "react-native-elements";

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
    const vendor = vendors.find(vendor => vendor.id == id)
    return vendor.vendor_Name
  };
  const getUnit = (id) => {
    const unit = units.find(unit => unit.id == id)
    return unit.name
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
        const response = await axios.get(
          "http://10.4.15.12:8004/api/vendors",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setVendors(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchUnits = async () => {
      try {
        const response = await axios.get(
          "http://10.4.15.12:8004/api/units",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
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
              <Text>Item Code: {item.item_Id}</Text>
              <Text>Item Name: {item.item_master?.item_name}</Text>
              <Text>Preferred Supplier: {item.prepared_supplier_id?getVendor(item.prepared_supplier_id):''}</Text>
              <Text>Quantity: {item?.item_Request_Qty}</Text>
              <Text>UOM: {getUnit(item.item_Request_UnitofMeasurement_Id)}</Text>
              <Text>
                Approved Quantity: {item?.item_Request_Department_Approved_Qty}
              </Text>
              <Text>
                Approved UOM:{" "}
                {item?.item_Request_Department_Approved_UnitofMeasurement_Id}
              </Text>
              <Text>Action</Text>
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
});

export default DepartmentHead;
