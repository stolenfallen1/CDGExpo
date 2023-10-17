import { View } from "react-native";
import React from "react";
import { useRecoilValue } from "recoil";
import { userRoleState } from "../../atoms/userRoleState";
import DepartmentHead from "./departmentHead/DepartmentHead";
import ConsultantDashboard from "./consultant/consultantDashboard";
import PODashboard from "./PurchaseOrder/PODashboard";
import {
  AdminDashboardTabs,
  ComptrollerDashboardTabs,
} from "../../navigation/BottomContent";

const Dashboard = () => {
  const userRole = useRecoilValue(userRoleState);

  return (
    <View style={{ flex: 1 }}>
      {/* CONDITIONAL RENDERING BASED ON USER ROLE */}
      {userRole === "administrator" && <AdminDashboardTabs />}
      {userRole === "department head" && <DepartmentHead />}
      {userRole === "consultant" && <ConsultantDashboard />}
      {userRole === "comptroller" && <ComptrollerDashboardTabs />}
      {userRole === "corporate admin" && <PODashboard />}
      {userRole === "president" && <PODashboard />}
    </View>
  );
};

export default Dashboard;
