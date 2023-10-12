import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { customStyles } from "../../styles/customStyles";
import Modal from "react-native-modal";
import { Button } from "react-native-elements";
import { authTokenState } from "../../atoms/authTokenState";
import { useRecoilValue } from "recoil";
import ItemHeader from "../ItemHeader";
import axios from "axios";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

const CorporateAdminModal = ({ modalVisible, closeModal, selectedID }) => {
  const authToken = useRecoilValue(authTokenState);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${apiKey}/purchase-order/${selectedID}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [authToken, selectedID]);

  return (
    <View>
      <Modal isVisible={modalVisible} style={customStyles.modalContainer}>
        <ItemHeader />
        <View style={{ marginLeft: 16, marginTop: 15 }}>
          <Text>TEST</Text>
        </View>
        <Button
          title={"Back"}
          buttonStyle={customStyles.cancelButton}
          onPress={closeModal}
        />
      </Modal>
    </View>
  );
};

export default CorporateAdminModal;
