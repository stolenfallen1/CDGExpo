import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
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
  const route = useRoute();
  const { id } = route.params;
  const { isStatus } = route.params;
  const authToken = useRecoilValue(authTokenState);
  const userPasscode = useRecoilValue(userPassword);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiKey}/purchase-request/${id}?tab=6`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const newData = { ...response.data, isStatus };
        setData(newData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [id, authToken]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 20,
        paddingBottom: 40,
      }}
    >
      <ScrollView horizontal={true}>
        {data?.purchase_request_details?.map((item, index) => (
          <Card key={index} containerStyle={styles.cardContainer}>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputTextBold}>Code: {item?.id}</Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputTextBold}>Item Name: </Text>
                <Text style={styles.inputText}>
                  {item?.item_master?.item_name}
                </Text>
              </View>
              <View style={{ marginTop: 10, justifyContent: "space-between" }}>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 17,
                    fontWeight: "bold",
                  }}
                >
                  Approved
                </Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputTextBold}>Quantity: </Text>
                  <Text style={styles.inputText}>
                    {item?.item_Branch_Level1_Approved_Qty}
                  </Text>
                  {/* Spacer */}
                  <View style={{ paddingHorizontal: 5 }} />
                  <Text style={styles.inputTextBold}>Units: </Text>
                  <Text style={styles.inputText}>
                    {item?.item_Branch_Level1_Approved_UnitofMeasurement_Id}
                  </Text>
                </View>
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
                <Text style={styles.inputTextBold}>Discount: </Text>
                <Text style={styles.inputText}>
                  {item?.recommended_canvas?.canvas_item_discount_percent}
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputTextBold}>Vat: </Text>
                <Text style={styles.inputText}>
                  {item?.recommended_canvas?.canvas_item_vat_rate}
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputTextBold}>Date Approved: </Text>
                <Text style={styles.inputText}>
                  {item?.pr_Branch_Level1_ApprovedDate}
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputTextBold}>Recommended: </Text>
                <Text style={styles.inputText}>
                  {item?.recommended_canvas?.vendor?.vendor_Name}
                </Text>
              </View>
              <TouchableOpacity>
                <Ionicons
                  name="eye"
                  color={"green"}
                  size={18}
                  style={{ marginTop: 10 }}
                />
              </TouchableOpacity>
              <CheckBox
                title={"Approved"}
                checked={true}
                containerStyle={{ marginTop: 20 }}
              />
            </View>
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
      />
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
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },
  inputTextBold: {
    fontSize: 17,
    fontWeight: "bold",
  },
  inputText: {
    fontSize: 17,
    textDecorationLine: "underline",
    textDecorationColor: "lightgrey",
  },
});

export default ApproveItems;
