import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Card } from "react-native-elements";
import React, { useState } from "react";

const CardData = ({
  prId,
  transactionDate,
  requestingName,
  itemGroup,
  category,
  justification,
}) => {
  return (
    <>
      <TouchableOpacity>
        <Card containerStyle={styles.cardContainer}>
          <Text style={styles.prId}>PR No: {prId} </Text>
          <Text style={styles.cardText}>Date Request: {transactionDate} </Text>
          <Text style={styles.cardText}>Requesting: {requestingName} </Text>
          <Text style={styles.cardText}>Item group: {itemGroup} </Text>
          <Text style={styles.cardText}>Category: {category} </Text>
          <Text style={styles.cardText}>PR Status: For Approval </Text>
          <Text style={styles.cardText}>
            Date approved: Need to add condition
          </Text>
          <Text style={styles.cardText}>Remarks: {justification} </Text>
        </Card>
      </TouchableOpacity>
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
});

export default CardData;
