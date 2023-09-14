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
  const [selectedCardData, setSelectedCardData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const handleCardPress = (cardData, cardKey) => {
    setSelectedCardData({ ...cardData, cardKey });
    toggleModal();
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
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
        <View style={styles.cardContainer}>
          <Card>
            <Text>Item Code: {selectedCardData?.id} </Text>
            <Text>Item Code:</Text>
            <Text>Preferred Supplier:</Text>
            <Text>Quantity:</Text>
            <Text>UOM:</Text>
            <Text>Approved Quantity:</Text>
            <Text>Approved UOM:</Text>
            <Text>Action</Text>
            <Button title="Approve" />
          </Card>
        </View>
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
    marginBottom: 50,
  },
  cardContainer: {
    paddingHorizontal: 20,
  },
});

export default DepartmentHead;
