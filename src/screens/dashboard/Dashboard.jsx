import { View, Text } from "react-native";
import React from "react";
import { useRecoilValue } from "recoil";
import { userRoleState } from "../../atoms/userRoleState";
import AdminDashboard from "./admin/adminDashboard";
import DepartmentHead from "./departmentHead/DepartmentHead";
import ConsultantDashboard from "./consultant/consultantDashboard";
// import ComptrollerDashboard from "./comptroller/ComptrollerDashboard";
// import PresidentDashboard from "./president/PresidentDashboard";

const Dashboard = () => {
  const userRole = useRecoilValue(userRoleState);

  return (
    <View>
      {/* CONDITIONAL RENDERING BASED ON USER ROLE */}
      {userRole === "administrator" && <AdminDashboard />}
      {userRole === "department head" && <DepartmentHead />}
      {userRole === "consultant" && <ConsultantDashboard />}
      {/* {userRole === "comptroller" && <ComptrollerDashboard />} */}
      {/* {userRole === "president" && <PresidentDashboard />} */}
    </View>
  );
};

export default Dashboard;
