import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useRecoilValue } from "recoil";
import { userRoleState } from "../atoms/userRoleState";

const ItemHeader = ({
  prNum,
  name,
  warehouse,
  requestedBy,
  dateRequested,
  approvedByDate,
}) => {
  const userRole = useRecoilValue(userRoleState);
  return (
    <>
      <Text style={styles.modalTextInfo}>
        PR No:
        <Text style={{ fontWeight: "400" }}> {prNum}</Text>
      </Text>
      <Text style={styles.modalTextInfo}>
        Name:
        <Text style={{ fontWeight: "400" }}> {name}</Text>
      </Text>
      <Text style={styles.modalTextInfo}>
        Department:
        <Text style={{ fontWeight: "400" }}> {warehouse}</Text>
      </Text>
      <Text style={styles.modalTextInfo}>
        Requested By:
        <Text style={{ fontWeight: "400" }}> {requestedBy}</Text>
      </Text>
      <Text style={styles.modalTextInfo}>
        Date Requested:
        <Text style={{ fontWeight: "400" }}> {dateRequested}</Text>
      </Text>
      {userRole === "administrator" || userRole === "consultant" ? (
        <Text style={styles.modalTextInfo}>
          Approved by Department Head:
          <Text style={{ fontWeight: "400" }}> {approvedByDate}</Text>
        </Text>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  modalTextInfo: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
});

export default ItemHeader;
