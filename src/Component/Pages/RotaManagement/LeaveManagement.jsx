import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
 

const LeaveManagement = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="list" replace />} />
      <Route path="list" element={<LeaveList />} />
      <Route path="details" element={<LeaveDetails />} />
      <Route path="details/:id" element={<LeaveDetails />} />
      <Route path="add" element={<AddLeaveRequest />} />
      <Route path="edit/:id" element={<AddLeaveRequest />} />
    </Routes>
  );
};

export default LeaveManagement; 