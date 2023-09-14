import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Card } from "react-native-elements";
import React from "react";

const CardData = ({
  cardKey,
  prId,
  transactionDate,
  requestingName,
  itemGroup,
  category,
  quantity,
  justification,
}) => {
  return (
    <>
      <Card containerStyle={styles.cardContainer}>
        <Text style={styles.prId}>PR No: {prId} </Text>
        <Text style={styles.cardText}>Date Request: {transactionDate}</Text>
        <Text style={styles.cardText}>Requesting: {requestingName} </Text>
        <Text style={styles.cardText}>Item group: {itemGroup} </Text>
        <Text style={styles.cardText}>Category: {category} </Text>
        {/* Only the department head can change the quantity */}
        <Text style={styles.cardText}>Quantity: {quantity} </Text>
        <Text style={styles.cardText}>PR Status: For Approval </Text>
        <Text style={styles.cardText}>
          Date approved: Need to add condition
        </Text>
        <Text style={styles.cardText}>Remarks: {justification} </Text>
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    borderColor: "#66B5D1",
  },
  prId: {
    fontWeight: "bold",
    fontSize: 20,
  },
  cardText: {
    fontSize: 18,
  },
  modalContainer: {
    paddingHorizontal: 15,
  },
  approveBtn: {
    position: "absolute",
    bottom: 20,
    paddingVertical: 10,
    alignSelf: "center",
    backgroundColor: "#66B5D1",
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  approveTxt: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CardData;
