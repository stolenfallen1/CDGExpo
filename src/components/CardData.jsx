import { Text, TouchableOpacity, StyleSheet } from "react-native";
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
      justification,
    },
    ref
  ) => {
    const snapoints = useMemo(() => ["65%"], []);
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

    return (
      <>
        <TouchableOpacity onPress={() => ref.current?.present()}>
          <Card containerStyle={styles.cardContainer}>
            <Text style={styles.prId}>PR No: {prId} </Text>
            <Text style={styles.cardText}>Date Request: {transactionDate}</Text>
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
        <BottomSheetModal
          ref={ref}
          snapPoints={snapoints}
          backdropComponent={renderBackdrop}
          overDragResistanceFactor={0}
        >
          <Text>Hello World</Text>
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
});

export default CardData;
