import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Input } from "react-native-elements";
import { Card } from "react-native-elements";
import React, { useMemo, forwardRef, useCallback } from "react";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";

const CardData = forwardRef(
  (
    {
      prId,
      transactionDate,
      requestingName,
      itemGroup,
      category,
      quantity,
      justification,
    },
    ref
  ) => {
    const snapoints = useMemo(() => ["70%"], []);
    const renderBackdrop = useCallback(
      (props) => (
        <BottomSheetBackdrop
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          {...props}
        />
      ),
      []
    );

    const handleApprove = () => {
      // Approve logic here
    };

    return (
      <>
        <TouchableOpacity onPress={() => ref.current?.present()}>
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
        </TouchableOpacity>
        <BottomSheetModal
          ref={ref}
          snapPoints={snapoints}
          backdropComponent={renderBackdrop}
          overDragResistanceFactor={0}
        >
          <View style={styles.modalContainer}>
            <Input
              inputStyle={{ fontWeight: "bold" }}
              label="PR No"
              value={prId}
              editable={false}
            />
            <Input
              label="Transaction Date"
              value={transactionDate}
              editable={false}
            />
            <Input label="Requester" value={requestingName} editable={false} />
            <Input label="Quantity" value={quantity} editable={true} />
            <Input label="Item Group" value={itemGroup} editable={false} />
            <Input label="Category" value={category} editable={false} />
          </View>
          <TouchableOpacity style={styles.approveBtn} onPress={handleApprove}>
            <Text style={styles.approveTxt}>Approve</Text>
          </TouchableOpacity>
        </BottomSheetModal>
      </>
    );
  }
);

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
