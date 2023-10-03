import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../../atoms/authTokenState";
import { userPassword } from "../../../atoms/userPassword";
import { Card, Button, CheckBox } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

// http://10.4.15.12:8004/api/purchase-request/{id}?tab=6 (pr id)

// Display data
// Approve data

const ApproveItems = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pr_id } = route.params;
  const { isStatus } = route.params;
  const authToken = useRecoilValue(authTokenState);
  const userPasscode = useRecoilValue(userPassword);
  const [data, setData] = useState([]);
  const [units, setUnits] = useState([]);

  const handlePress = (item_id) => {
    navigation.navigate("SupplierCanvasList", { item_id });
  };

  const getUnit = (id) => {
    const unit = units.find((unit) => unit.id == id);
    return unit?.name;
  };

  // handle all item approval checkbox state
  const handleAllItemApproval = () => {};

  // handle single item approval checkbox state
  const handleItemApproval = (itemId) => {
    const newData = data?.purchase_request_details?.map((item) => {
      if (item.id === itemId) {
        return { ...item, status: !item.status };
      }
      return item;
    });
    setData({
      ...data,
      purchase_request_details: newData,
    });
  };

  // handle submit button event /api/approve-canvas
  const handleSubmit = async () => {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiKey}/purchase-request/${pr_id}?tab=6`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const newData = { ...response.data, status: isStatus };
        newData.purchase_request_details = newData.purchase_request_details.map(
          (item) => ({ ...item, status: true })
        );
        setData(newData);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchUnits = async () => {
      try {
        const response = await axios.get(`${apiKey}/units`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setUnits(response.data.units);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUnits();
    fetchData();
  }, [pr_id, authToken, isStatus]);

  return (
    <View style={{ paddingBottom: 245 }}>
      <View style={{ marginLeft: 16, marginTop: 15 }}>
        <Text style={styles.modalTextInfo}>
          PR No:
          <Text style={{ fontWeight: "400" }}> {data?.pr_Document_Number}</Text>
        </Text>
        <Text style={styles.modalTextInfo}>
          Name:
          <Text style={{ fontWeight: "400" }}> {data?.user?.branch?.name}</Text>
        </Text>
        <Text style={styles.modalTextInfo}>
          Department:
          <Text style={{ fontWeight: "400" }}>
            {" "}
            {data?.warehouse?.warehouse_description}
          </Text>
        </Text>
        <Text style={styles.modalTextInfo}>
          Requested By:
          <Text style={{ fontWeight: "400" }}> {data?.user?.name}</Text>
        </Text>
        <Text style={styles.modalTextInfo}>
          Date Requested:
          <Text style={{ fontWeight: "400" }}>
            {" "}
            {new Date(data?.pr_Transaction_Date).toLocaleDateString()}
          </Text>
        </Text>
        <CheckBox
          title={"Approve All Request"}
          containerStyle={{
            marginRight: 30,
            backgroundColor: "lightgreen",
            borderRadius: 10,
          }}
        />
      </View>
      <ScrollView>
        {data?.purchase_request_details?.map((item, index) => (
          <Card key={index} containerStyle={styles.cardContainer}>
            <View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputTextBold}>Item Name: </Text>
                <Text style={styles.inputText}>
                  {item?.item_master?.item_name}
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputTextBold}>Quantity: </Text>
                <Text style={styles.inputText}>
                  {item?.item_Branch_Level1_Approved_Qty}
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputTextBold}>Unit of Measurement: </Text>
                <Text style={styles.inputText}>
                  {getUnit(
                    item?.item_Branch_Level1_Approved_UnitofMeasurement_Id
                  )}
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputTextBold}>Price: </Text>
                <Text style={styles.inputText}>
                  {item?.recommended_canvas?.canvas_item_amount}
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputTextBold}>Total: </Text>
                <Text style={styles.inputText}>
                  {item?.recommended_canvas?.canvas_item_total_amount}
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputTextBold}>Recommended Supplier: </Text>
                <Text style={styles.inputText}>
                  {item?.recommended_canvas?.vendor?.vendor_Name}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => handlePress(item.id)}
              >
                <Ionicons
                  name="eye"
                  color={"green"}
                  size={18}
                  style={{ marginTop: 8 }}
                />
              </TouchableOpacity>
              <CheckBox
                title={"Approved by Purchaser"}
                containerStyle={{ borderRadius: 10 }}
                checked={item.status}
                onPress={() => handleItemApproval(item.id)}
              />
            </View>
          </Card>
        ))}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            backgroundColor: "transparent",
          }}
        >
          <Button
            title={"Submit"}
            buttonStyle={{
              backgroundColor: "orange",
              paddingHorizontal: 20,
              margin: 7,
              borderRadius: 10,
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    borderColor: "#66B5D1",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5.5,
    },
    shadowOpacity: 0.7,
    borderRadius: 12,
    marginBottom: 5,
  },
  modalTextInfo: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  inputContainer: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  inputTextBold: {
    fontSize: 14,
    fontWeight: "bold",
  },
  inputText: {
    fontSize: 16,
    textDecorationLine: "underline",
    textDecorationColor: "lightgrey",
  },
});

export default ApproveItems;
