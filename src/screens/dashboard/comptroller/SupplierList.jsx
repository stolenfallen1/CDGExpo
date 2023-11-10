import { View, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { authTokenState } from "../../../atoms/authTokenState";
import { useRecoilValue } from "recoil";
import { Card } from "react-native-elements";
import { customStyles } from "../../../styles/customStyles";
import axios from "axios";
import { ScrollView } from "react-native";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

const SupplierList = () => {
  const route = useRoute();
  const authToken = useRecoilValue(authTokenState);
  const { item_id } = route.params;
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiKey}/canvas?details_id=${item_id}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setData(response.data.data);
      } catch (error) {
        if (error.response.status === 401) {
          navigation.navigate("Login");
          alert("Session expired or another user has logged in.");
        } else {
          alert(
            "Something went wrong. Please try again.",
            error.response.status
          );
        }
      }
    };
    fetchData();
  }, [item_id, authToken]);

  return (
    <View style={{ paddingBottom: 40 }}>
      <ScrollView>
        {data.map((item) => (
          <Card key={item.id} containerStyle={customStyles.cardContainer}>
            <View style={customStyles.inputContainer}>
              <Text style={styles.inputTextBold}>Supplier Name: </Text>
              <Text style={styles.inputText}>{item?.vendor?.vendor_Name}</Text>
            </View>
            <View style={customStyles.inputContainer}>
              <Text style={styles.inputTextBold}>Price: </Text>
              <Text style={styles.inputText}>{item?.canvas_item_amount}</Text>
            </View>
            <View style={customStyles.inputContainer}>
              <Text style={styles.inputTextBold}>Quantity: </Text>
              <Text style={styles.inputText}>{item?.canvas_Item_Qty}</Text>
            </View>
            <View style={customStyles.inputContainer}>
              <Text style={styles.inputTextBold}>Unit of Measurement: </Text>
              <Text style={styles.inputText}>{item?.unit?.name}</Text>
            </View>
            <View style={customStyles.inputContainer}>
              <Text style={styles.inputTextBold}>Discount: </Text>
              <Text style={styles.inputText}>
                {item?.canvas_item_discount_percent}%
              </Text>
            </View>
            <View style={customStyles.inputContainer}>
              <Text style={styles.inputTextBold}>Vat Rate: </Text>
              <Text style={styles.inputText}>
                {item?.canvas_item_vat_rate}%
              </Text>
            </View>
            <View style={customStyles.inputContainer}>
              <Text style={styles.inputTextBold}>Lead Time: </Text>
              <Text style={styles.inputText}>
                {parseInt(item?.canvas_lead_time)}
                {" (in days)"}
              </Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default SupplierList;
