import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../../atoms/authTokenState";
import { Card } from "react-native-elements";
import { unitsData } from "../../../atoms/unitsData";
import ModalHeader from "../../../components/Modals/PRModalHeader";
import { customStyles } from "../../../styles/customStyles";
import { Ionicons } from "@expo/vector-icons";
import SupplierModal from "../../../components/Modals/SupplierModal";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

const ApprovedCanvas = () => {
  const route = useRoute();
  // Data passed from selected card
  const { pr_id } = route.params;
  // Auth states
  const authToken = useRecoilValue(authTokenState);
  // Data states
  const [data, setData] = useState([]);
  const units = useRecoilValue(unitsData);
  const [selectedID, setSelectedID] = useState();
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  const handleCardPress = (id) => {
    setSelectedID(id);
    setModalVisible(true);
  };

  const getUnit = (id) => {
    const unit = units.find((unit) => unit.id == id);
    return unit?.name;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${apiKey}/purchase-request/${pr_id}?tab=7`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setData(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [authToken, pr_id]);

  return (
    <View style={{ paddingBottom: 165 }}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : data.length === 0 ? (
        <Text style={customStyles.emptyText}>No items found</Text>
      ) : (
        <>
          <View style={{ marginLeft: 16, marginTop: 15 }}>
            <ModalHeader
              prNum={data?.pr_Document_Number}
              name={data?.user?.branch?.name}
              warehouse={data?.warehouse?.warehouse_description}
              requestedBy={data?.user?.name}
              dateRequested={new Date(
                data?.pr_Transaction_Date
              ).toLocaleDateString()}
            />
          </View>
          <ScrollView>
            {data?.purchase_request_details?.map((item, index) => (
              <Card key={index} containerStyle={customStyles.cardContainer}>
                <View>
                  <View style={customStyles.inputContainer}>
                    <Text style={customStyles.inputText}>Item Name: </Text>
                    <Text style={styles.textValue}>
                      {item?.item_master?.item_name}
                    </Text>
                  </View>
                  <View style={customStyles.inputContainer}>
                    <Text style={customStyles.inputText}>Quantity: </Text>
                    <Text style={styles.textValue}>
                      {item?.item_Branch_Level1_Approved_Qty}
                    </Text>
                  </View>
                  <View style={customStyles.inputContainer}>
                    <Text style={customStyles.inputText}>
                      Unit of Measurement:{" "}
                    </Text>
                    <Text style={styles.textValue}>
                      {getUnit(
                        item?.item_Branch_Level1_Approved_UnitofMeasurement_Id
                      )}
                    </Text>
                  </View>
                  <View style={customStyles.inputContainer}>
                    <Text style={customStyles.inputText}>Price: </Text>
                    <Text style={styles.textValue}>
                      {item?.recommended_canvas?.canvas_item_amount}
                    </Text>
                  </View>
                  <View style={customStyles.inputContainer}>
                    <Text style={customStyles.inputText}>Total: </Text>
                    <Text style={styles.textValue}>
                      {item?.recommended_canvas?.canvas_item_total_amount}
                    </Text>
                  </View>
                  <View style={customStyles.inputContainer}>
                    <Text style={customStyles.inputText}>Discount: </Text>
                    <Text style={styles.textValue}>
                      {item?.recommended_canvas?.canvas_item_discount_percent}%
                    </Text>
                  </View>
                  <View style={customStyles.inputContainer}>
                    <Text style={customStyles.inputText}>Vat: </Text>
                    <Text style={styles.textValue}>
                      {item?.recommended_canvas?.canvas_item_vat_rate}%
                    </Text>
                  </View>
                  <View style={customStyles.inputContainer}>
                    <Text style={customStyles.inputText}>
                      Recommended Supplier:{" "}
                    </Text>
                    <Text style={styles.textValue}>
                      {item?.recommended_canvas?.vendor?.vendor_Name}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={customStyles.inputContainer}
                    onPress={() => handleCardPress(item.id)}
                  >
                    <Ionicons
                      name="eye"
                      color={"green"}
                      size={18}
                      style={{ marginTop: 8 }}
                    />
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </ScrollView>
          <SupplierModal
            modalVisible={modalVisible}
            selectedID={selectedID}
            closeModal={() => setModalVisible(false)}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textValue: {
    fontSize: 16,
    textDecorationLine: "underline",
    textDecorationColor: "lightgrey",
  },
});

export default ApprovedCanvas;
